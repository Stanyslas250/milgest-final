# PRD — Milgest

## Product Requirements Document v1.0

---

## METADATA

```
project_name: Milgest
version: 1.0.0
status: draft
last_updated: 2025-04
audience: AI coding assistant (Cursor), lead developer
language: French (UI), English (code)
```

---

## 1. PROJECT OVERVIEW

### 1.1 Vision

Milgest est un ERP de gestion de militants conçu pour les organisations politiques, associations et ONG. Le point focal du produit est la **data** : chaque fonctionnalité est pensée pour collecter, structurer, analyser et restituer l'information sur les membres et leurs activités.

### 1.2 Core value proposition

- Centraliser la gestion des membres, cotisations, dons et évolutions de grade en un seul outil
- Offrir des dashboards data-driven avec graphiques dynamiques et statistiques de répartition
- Permettre la production de documents officiels avec filigrane personnalisé à l'impression
- Être déployable à coût zéro au démarrage (free tiers uniquement)

### 1.3 Target users

| Rôle          | Description                                         |
| ------------- | --------------------------------------------------- |
| `SUPER_ADMIN` | Administrateur technique de la plateforme           |
| `ORG_ADMIN`   | Responsable d'une organisation (association, parti) |
| `MANAGER`     | Responsable de section ou de région                 |
| `COMPTABLE`   | Responsable financier                               |
| `MEMBER`      | Militant avec accès limité à son propre profil      |
| `READONLY`    | Observateur sans droit de modification              |

---

## 2. TECH STACK

### 2.1 Architecture globale

```
┌─────────────────────────────────────────────────────────────┐
│  FRONTEND        Next.js 14 (App Router)   → Vercel Free    │
├─────────────────────────────────────────────────────────────┤
│  API CORE        Django 5 + DRF            → Railway Free   │
│  API REST        FastAPI + Pydantic        → Render Free    │
│  WORKERS         Celery + Redis            → Railway Free   │
├─────────────────────────────────────────────────────────────┤
│  DATABASE        PostgreSQL (Neon Free)    → 500 MB         │
│  CACHE / QUEUE   Redis (Upstash Free)      → 10k req/day    │
│  FILE STORAGE    Cloudflare R2             → 10 GB free     │
├─────────────────────────────────────────────────────────────┤
│  EMAILS          Resend Free               → 3k/month       │
│  MONITORING      Sentry Free               → 5k errors/mo   │
│  CI/CD           GitHub Actions            → 2000 min/mo    │
│  SECRETS         Doppler Free              → env vars sync  │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Backend — Django (data core)

- **Framework** : Django 5.x
- **API layer** : Django REST Framework (DRF)
- **ORM** : Django ORM natif
- **Auth** : Django Auth + SimpleJWT
- **Permissions** : RBAC custom via Django permissions + django-guardian
- **Tasks** : Celery 5 + Redis (Upstash)
- **Admin** : Django Admin (back-office interne)
- **Multi-tenant** : django-tenants (schema PostgreSQL par organisation)
- **PDF generation** : WeasyPrint (server-side, avec filigrane)
- **Excel import** : openpyxl

**Responsabilités Django :**

- Définition et migration des modèles de données
- Authentification et gestion des sessions
- Django Admin pour supervision interne
- Tâches async via Celery (import batch, emails, génération PDF)
- Endpoints CRUD standards via DRF

### 2.3 Backend — FastAPI (REST endpoints)

- **Framework** : FastAPI 0.110+
- **Validation** : Pydantic v2
- **ORM** : SQLAlchemy 2 (partage la même DB PostgreSQL que Django)
- **Auth** : JWT validation (tokens émis par Django)
- **Docs** : Swagger UI auto-généré sur `/api/docs`
- **WebSockets** : pour notifications temps réel (optionnel phase 2)

**Responsabilités FastAPI :**

- Tous les endpoints consommés par le frontend Next.js
- Routes de stats et agrégations lourdes (optimisées via SQLAlchemy raw queries)
- Upload de fichiers vers Cloudflare R2
- Endpoints d'export (CSV, Excel, PDF via Celery)
- WebSockets pour dashboard live (phase 2)

> **Convention** : Django gère le schéma DB et les migrations. FastAPI ne crée jamais de migration — il lit/écrit via SQLAlchemy en respectant le schéma Django.

### 2.4 Frontend — Next.js 14

- **Framework** : Next.js 14 (App Router)
- **Language** : TypeScript strict
- **UI** : shadcn/ui + Tailwind CSS
- **State / Data fetching** : TanStack Query v5
- **Tables** : TanStack Table v8 (virtualisation pour grandes listes)
- **Charts** : Recharts 2
- **Forms** : React Hook Form + Zod
- **Editor** : Tiptap 2 (éditeur de documents)
- **PDF preview** : react-pdf

### 2.5 Infrastructure

- **Containerisation** : Docker + Docker Compose (dev local)
- **CI/CD** : GitHub Actions (tests → build → deploy)
- **Branches** : `main` (prod), `develop` (staging), feature branches
- **Env management** : Doppler (sync vers Railway, Render, Vercel)

---

## 3. DATABASE SCHEMA

### 3.1 Conventions

```
- UUIDs comme clés primaires (uuid4)
- Timestamps : created_at, updated_at sur toutes les tables
- Soft delete : deleted_at nullable (pas de suppression physique)
- Multi-tenant : chaque organisation a son propre schema PostgreSQL
- Audit log : table dédiée pour toutes les mutations critiques
```

### 3.2 Core models

#### Organization

```python
class Organization(models.Model):
    id = UUIDField(primary_key=True)
    name = CharField(max_length=255)
    slug = SlugField(unique=True)
    type = CharField(choices=['political_party', 'association', 'ngo', 'union'])
    logo = FileField(nullable)
    watermark_text = CharField(max_length=100, nullable)  # filigrane par défaut
    watermark_logo = FileField(nullable)
    settings = JSONField(default=dict)  # config flexible par org
    created_at, updated_at
```

#### Member

```python
class Member(models.Model):
    id = UUIDField(primary_key=True)
    organization = ForeignKey(Organization)
    # Identité
    first_name = CharField(max_length=100)
    last_name = CharField(max_length=100)
    date_of_birth = DateField(nullable)
    gender = CharField(choices=['M', 'F', 'other', 'unspecified'], nullable)
    photo = FileField(nullable)
    # Contact
    email = EmailField(nullable)
    phone = CharField(max_length=20, nullable)
    address = TextField(nullable)
    city = CharField(max_length=100, nullable)
    region = CharField(max_length=100, nullable)
    country = CharField(max_length=100, default='GA')  # Gabon par défaut
    # Statut
    status = CharField(choices=['active', 'inactive', 'suspended', 'deceased'])
    membership_number = CharField(unique=True, nullable)  # numéro adhérent
    joined_at = DateField()
    # Métadonnées
    external_id = CharField(nullable)  # ID depuis import Excel
    import_source = CharField(nullable)
    custom_fields = JSONField(default=dict)  # champs org-spécifiques
    created_at, updated_at, deleted_at
```

#### Grade (système de grades/niveaux)

```python
class Grade(models.Model):
    id = UUIDField(primary_key=True)
    organization = ForeignKey(Organization)
    name = CharField(max_length=100)       # ex: "Militant", "Responsable", "Dirigeant"
    code = CharField(max_length=20)        # ex: "M1", "R2"
    level = IntegerField()                 # ordre hiérarchique
    color = CharField(max_length=7)        # hex pour affichage
    description = TextField(nullable)
    promotion_rules = JSONField(default=dict)  # règles auto de promotion
    created_at, updated_at
```

#### MemberGrade (historique d'évolution)

```python
class MemberGrade(models.Model):
    id = UUIDField(primary_key=True)
    member = ForeignKey(Member)
    grade = ForeignKey(Grade)
    assigned_at = DateTimeField()
    assigned_by = ForeignKey(User, nullable)  # null = système automatique
    reason = TextField(nullable)
    is_current = BooleanField(default=True)
    created_at
```

#### MembershipPeriod (adhésion annuelle)

```python
class MembershipPeriod(models.Model):
    id = UUIDField(primary_key=True)
    member = ForeignKey(Member)
    year = IntegerField()
    start_date = DateField()
    end_date = DateField()
    status = CharField(choices=['active', 'expired', 'cancelled'])
    created_at, updated_at
```

#### Contribution (cotisations)

```python
class Contribution(models.Model):
    id = UUIDField(primary_key=True)
    member = ForeignKey(Member)
    membership_period = ForeignKey(MembershipPeriod, nullable)
    amount = DecimalField(max_digits=10, decimal_places=2)
    currency = CharField(max_length=3, default='XAF')
    payment_date = DateField()
    payment_method = CharField(choices=['cash', 'bank_transfer', 'mobile_money', 'online'])
    reference = CharField(nullable)
    notes = TextField(nullable)
    receipt_generated = BooleanField(default=False)
    receipt_file = FileField(nullable)
    recorded_by = ForeignKey(User)
    created_at, updated_at
```

#### Donation (dons)

```python
class Donation(models.Model):
    id = UUIDField(primary_key=True)
    organization = ForeignKey(Organization)
    donor_member = ForeignKey(Member, nullable)  # null si donateur externe
    donor_name = CharField(nullable)             # si non-membre
    donor_email = EmailField(nullable)
    amount = DecimalField(max_digits=12, decimal_places=2)
    currency = CharField(max_length=3, default='XAF')
    donation_date = DateField()
    payment_method = CharField(choices=['cash', 'bank_transfer', 'mobile_money', 'online'])
    campaign = CharField(nullable)
    is_anonymous = BooleanField(default=False)
    receipt_generated = BooleanField(default=False)
    receipt_file = FileField(nullable)
    created_at, updated_at
```

#### Document

```python
class Document(models.Model):
    id = UUIDField(primary_key=True)
    organization = ForeignKey(Organization)
    title = CharField(max_length=255)
    content = JSONField()                  # format Tiptap JSON
    template = ForeignKey('DocumentTemplate', nullable)
    variables = JSONField(default=dict)    # valeurs des variables {{nom}}, etc.
    status = CharField(choices=['draft', 'published', 'archived'])
    created_by = ForeignKey(User)
    created_at, updated_at, deleted_at
```

#### DocumentTemplate

```python
class DocumentTemplate(models.Model):
    id = UUIDField(primary_key=True)
    organization = ForeignKey(Organization)
    name = CharField(max_length=255)
    description = TextField(nullable)
    content = JSONField()                  # format Tiptap JSON
    available_variables = JSONField()      # liste des {{variables}} disponibles
    category = CharField(choices=['letter', 'certificate', 'report', 'notice', 'other'])
    is_global = BooleanField(default=False)  # template partagé toutes orgs
    created_by = ForeignKey(User)
    created_at, updated_at
```

#### AuditLog

```python
class AuditLog(models.Model):
    id = UUIDField(primary_key=True)
    organization = ForeignKey(Organization)
    user = ForeignKey(User, nullable)
    action = CharField()                   # ex: 'member.created', 'grade.promoted'
    target_model = CharField()
    target_id = UUIDField()
    old_values = JSONField(nullable)
    new_values = JSONField(nullable)
    ip_address = GenericIPAddressField(nullable)
    created_at
```

---

## 4. FEATURE SPECIFICATIONS

### 4.1 MODULE : Gestion des membres

#### 4.1.1 Fiche membre

**Données affichées :**

- Identité complète (nom, prénom, date de naissance, genre, photo)
- Informations de contact (email, téléphone, adresse, ville, région)
- Grade actuel + historique des évolutions avec timeline
- Historique des cotisations (années, montants, statuts)
- Historique des dons
- Documents associés
- Activité récente (audit log filtré)

**Actions disponibles :**

- Modifier les informations (selon rôle)
- Changer de grade (manuellement)
- Enregistrer une cotisation
- Générer un document (lettre, certificat)
- Suspendre / réactiver / archiver le membre
- Voir et télécharger les reçus

#### 4.1.2 Import depuis Excel

**Spécifications :**

```
Format accepté : .xlsx, .xls, .csv
Taille max : 10 MB
Colonnes minimales requises : first_name, last_name
Colonnes optionnelles : email, phone, date_of_birth, gender, city, region, grade, joined_at, membership_number

Comportement :
1. Upload du fichier → prévisualisation des 10 premières lignes
2. Mapping des colonnes (UI glisser-déposer : colonne fichier → champ Milgest)
3. Validation : détection des erreurs (email invalide, doublon, champ manquant)
4. Rapport de validation : N valides, N erreurs, N doublons détectés
5. Confirmation → import batch via Celery (tâche async)
6. Notification email à l'admin quand terminé
7. Rapport d'import téléchargeable (lignes importées, lignes en erreur)

Détection doublons : par (first_name + last_name + date_of_birth) ou par email
Stratégie doublon : skip | update | create_anyway (choix avant import)
```

#### 4.1.3 Recherche et filtres

**Filtres disponibles :**

```
- Statut (actif, inactif, suspendu)
- Grade (un ou plusieurs)
- Région / ville
- Année d'adhésion
- Cotisation à jour (oui/non)
- Sexe
- Tranche d'âge
- Combinaison libre de filtres (AND logic)

Recherche full-text : prénom, nom, email, numéro adhérent
Tri : alphabétique, date d'adhésion, grade, dernière cotisation
Pagination : 25 / 50 / 100 par page
Export des résultats filtrés : Excel, CSV
```

---

### 4.2 MODULE : Cotisations & Dons

#### 4.2.1 Cotisations

**Enregistrement d'une cotisation :**

```
Champs requis : member, amount, payment_date, payment_method
Champs optionnels : reference, notes, membership_period

Actions automatiques lors de l'enregistrement :
- Mise à jour du statut "cotisation à jour" sur la fiche membre
- Génération optionnelle d'un reçu PDF
- Envoi optionnel du reçu par email
```

**Suivi des cotisations :**

```
Vue tableau : liste des cotisations avec filtres (période, statut, montant)
Vue membre : historique complet par membre
Alertes : membres dont la cotisation expire dans < 30 jours
Relances automatiques : email automatique configurable (J-30, J-7, J+7)
```

#### 4.2.2 Dons

**Enregistrement d'un don :**

```
Donateur : membre existant (lié) ou externe (nom + email saisi)
Don anonyme : possible (is_anonymous=True, nom masqué dans exports publics)
Reçu fiscal : générable en PDF avec filigrane organisation
```

#### 4.2.3 Reçus PDF

```
Générés server-side via WeasyPrint + Celery
Contenu : logo org, coordonnées, détails paiement, numéro de reçu unique
Filigrane : logo ou texte de l'organisation (configurable par org)
Stockage : Cloudflare R2, lien signé 1h pour téléchargement
Numérotation : {YEAR}-{ORG_CODE}-{SEQUENCE} ex: 2025-MIL-00042
```

---

### 4.3 MODULE : Évolution des membres

#### 4.3.1 Système de grades

**Configuration des grades :**

```
L'admin org définit N grades ordonnés par level (1 = plus bas)
Chaque grade a : name, code, level, color, description, promotion_rules

Exemple de structure :
Level 1 : Sympathisant
Level 2 : Adhérent
Level 3 : Militant actif
Level 4 : Responsable local
Level 5 : Dirigeant national
```

#### 4.3.2 Règles de promotion automatique

**Format des règles (JSON) :**

```json
{
  "promotion_rules": {
    "to_grade": "militant_actif",
    "conditions": {
      "operator": "AND",
      "rules": [
        { "type": "membership_duration_months", "min": 12 },
        { "type": "contributions_paid_years", "min": 2 },
        { "type": "current_grade", "is": "adherent" }
      ]
    },
    "auto_apply": false,
    "requires_validation": true,
    "validator_role": "ORG_ADMIN"
  }
}
```

**Types de règles disponibles :**

```
- membership_duration_months : ancienneté minimale
- contributions_paid_years : années de cotisation payées
- contributions_consecutive_years : années consécutives
- current_grade : grade actuel requis
- manual_validation : approbation humaine obligatoire
- age_min / age_max : tranche d'âge
- region : appartenance géographique
```

**Flux de promotion :**

```
Automatique (auto_apply=true) :
  Celery job quotidien → évalue les règles → promeut si conditions remplies → notifie l'admin

Manuel :
  Admin sélectionne un ou plusieurs membres → choisit le nouveau grade
  → saisit un motif (obligatoire) → enregistre → notification membre

Avec validation (requires_validation=true) :
  Proposition créée → validateur notifié → approuve/refuse → exécution ou rejet
```

---

### 4.4 MODULE : Éditeur de documents

#### 4.4.1 Éditeur WYSIWYG

**Fonctionnalités Tiptap :**

```
Formatting : bold, italic, underline, strikethrough, headings (H1-H3)
Listes : bullet, ordered, nested
Tableaux : insertion, redimensionnement, fusion de cellules
Images : upload vers R2, redimensionnement
Variables dynamiques : {{first_name}}, {{last_name}}, {{grade}}, {{membership_number}}, {{org_name}}, {{date}}, etc.
  → au rendu, remplacées par les valeurs réelles du membre cible
Sauvegarde auto : debounce 2s, sauvegarde en JSON Tiptap
```

#### 4.4.2 Templates de documents

```
Catégories : lettre, certificat, rapport, convocation, autre
Variables disponibles : définies par catégorie + champs custom de l'org
Partage : template privé (org) ou global (toutes orgs — SUPER_ADMIN seulement)
Prévisualisation : rendu HTML live dans l'éditeur
```

#### 4.4.3 Impression et export PDF avec filigrane

**Spécifications filigrane :**

```
Déclenchement : bouton "Imprimer / Exporter PDF" → modal de configuration

Options configurables :
  Type : texte libre | logo de l'organisation
  Texte : champ libre (ex: "CONFIDENTIEL", "ORIGINAL", nom de l'org)
  Police : taille, couleur (picker)
  Opacité : slider 0-100% (défaut: 20%)
  Angle : slider -90° à +90° (défaut: -45°)
  Position : centré (défaut) | répété en mosaïque
  Répétition : toggle (une fois centré | répété sur toute la page)

Valeurs par défaut : définies au niveau organisation (settings)
L'utilisateur peut modifier à chaque export — non sauvegardé par défaut
Option "Sauvegarder comme défaut pour ce document" disponible

Génération :
  → Appel POST /api/documents/{id}/export
  → Celery task : WeasyPrint → applique filigrane (CSS print ou canvas overlay)
  → Stockage R2, lien signé 30 min
  → Redirect vers téléchargement
```

---

### 4.5 MODULE : Statistics & Dashboards

#### 4.5.1 Dashboard principal

**KPIs affichés (metric cards) :**

```
- Total membres actifs
- Nouveaux membres ce mois
- Taux de renouvellement des cotisations (%)
- Total cotisations encaissées (période sélectionnable)
- Total dons reçus (période sélectionnable)
- Membres en retard de cotisation
```

#### 4.5.2 Graphiques disponibles

```
Graphique 1 — Évolution des membres
  Type : LineChart
  X : mois/années
  Y : nombre de membres actifs
  Filtres : région, grade

Graphique 2 — Répartition par grade
  Type : PieChart + BarChart
  Dimensions : grade, pourcentage, nombre absolu

Graphique 3 — Répartition géographique
  Type : BarChart horizontal
  Dimensions : région/ville, nombre de membres
  Tri : décroissant

Graphique 4 — Répartition démographique
  Type : BarChart groupé
  Dimensions : tranche d'âge (20-30, 30-40, etc.) × genre

Graphique 5 — Cotisations mensuelles
  Type : BarChart
  X : mois
  Y : montant encaissé
  Superposition : objectif (ligne de référence configurable)

Graphique 6 — Taux de cotisation par grade
  Type : BarChart horizontal
  Dimensions : grade → % membres à jour

Graphique 7 — Flux de promotions
  Type : Timeline / Sankey (phase 2)
  Dimensions : passages d'un grade à un autre
```

#### 4.5.3 Filtres globaux du dashboard

```
Période : sélecteur date (presets : ce mois, ce trimestre, cette année, personnalisé)
Région : multi-select
Grade : multi-select
Tous les graphiques réagissent aux filtres globaux
Export : bouton "Exporter le rapport" → PDF du dashboard complet
```

---

### 4.6 MODULE : Auth & RBAC

#### 4.6.1 Authentification

```
Méthode : email + mot de passe
Tokens : JWT (access 15min, refresh 7 jours)
Endpoints :
  POST /auth/login
  POST /auth/refresh
  POST /auth/logout
  POST /auth/forgot-password
  POST /auth/reset-password

Sécurité :
  - Rate limiting sur /auth/login (5 tentatives/15min)
  - Tokens refresh en httpOnly cookie
  - Access token en mémoire (pas de localStorage)
```

#### 4.6.2 Permissions par rôle

```
Action                          | SUPER_ADMIN | ORG_ADMIN | MANAGER | MEMBER | READONLY
--------------------------------|-------------|-----------|---------|--------|----------
Voir tous les membres           | ✓           | ✓         | ✓       | -      | ✓
Modifier un membre              | ✓           | ✓         | ✓       | self   | -
Importer des membres (Excel)    | ✓           | ✓         | -       | -      | -
Supprimer un membre             | ✓           | ✓         | -       | -      | -
Gérer les cotisations           | ✓           | ✓         | ✓       | -      | -
Voir les cotisations            | ✓           | ✓         | ✓       | self   | ✓
Gérer les grades                | ✓           | ✓         | -       | -      | -
Promouvoir un membre            | ✓           | ✓         | ✓*      | -      | -
Créer/éditer un document        | ✓           | ✓         | ✓       | -      | -
Exporter PDF avec filigrane     | ✓           | ✓         | ✓       | -      | -
Accéder aux dashboards          | ✓           | ✓         | ✓       | -      | ✓
Gérer les templates globaux     | ✓           | -         | -       | -      | -
Gérer les paramètres org        | ✓           | ✓         | -       | -      | -

* MANAGER peut promouvoir uniquement vers les grades inférieurs au sien
```

---

## 5. API SPECIFICATIONS

### 5.1 Conventions générales

```
Base URL Django admin  : /django-admin/
Base URL FastAPI       : /api/v1/
Auth header            : Authorization: Bearer {access_token}
Content-Type           : application/json
Pagination             : ?page=1&page_size=25
Tri                    : ?sort=last_name&order=asc
Recherche              : ?search=dupont
Format dates           : ISO 8601 (YYYY-MM-DD)
Format timestamps      : ISO 8601 (YYYY-MM-DDTHH:MM:SSZ)
```

### 5.2 Endpoints FastAPI

#### Members

```
GET    /api/v1/members                    # liste paginée + filtres
POST   /api/v1/members                    # créer un membre
GET    /api/v1/members/{id}               # détail membre
PATCH  /api/v1/members/{id}               # modifier membre
DELETE /api/v1/members/{id}               # soft delete
POST   /api/v1/members/import             # upload Excel → tâche Celery
GET    /api/v1/members/import/{task_id}   # statut de l'import
GET    /api/v1/members/{id}/grades        # historique grades
POST   /api/v1/members/{id}/grades        # assigner un grade
GET    /api/v1/members/{id}/contributions # cotisations du membre
GET    /api/v1/members/export             # export CSV/Excel (filtres appliqués)
```

#### Contributions

```
GET    /api/v1/contributions              # liste paginée
POST   /api/v1/contributions              # enregistrer une cotisation
GET    /api/v1/contributions/{id}         # détail
PATCH  /api/v1/contributions/{id}         # modifier
POST   /api/v1/contributions/{id}/receipt # générer reçu PDF
```

#### Donations

```
GET    /api/v1/donations
POST   /api/v1/donations
GET    /api/v1/donations/{id}
PATCH  /api/v1/donations/{id}
POST   /api/v1/donations/{id}/receipt
```

#### Documents

```
GET    /api/v1/documents
POST   /api/v1/documents
GET    /api/v1/documents/{id}
PATCH  /api/v1/documents/{id}
DELETE /api/v1/documents/{id}
POST   /api/v1/documents/{id}/export      # génère PDF avec options filigrane
GET    /api/v1/documents/templates        # liste des templates
POST   /api/v1/documents/templates        # créer un template
```

#### Statistics

```
GET    /api/v1/stats/overview             # KPIs globaux
GET    /api/v1/stats/members/evolution    # évolution temporelle
GET    /api/v1/stats/members/by-grade     # répartition par grade
GET    /api/v1/stats/members/by-region    # répartition géographique
GET    /api/v1/stats/members/demographics # répartition démographique
GET    /api/v1/stats/contributions/monthly # cotisations par mois
GET    /api/v1/stats/contributions/rate-by-grade # taux par grade
```

#### Auth

```
POST   /api/v1/auth/login
POST   /api/v1/auth/refresh
POST   /api/v1/auth/logout
POST   /api/v1/auth/forgot-password
POST   /api/v1/auth/reset-password/{token}
GET    /api/v1/auth/me
```

### 5.3 Réponses standardisées

```json
// Succès — liste paginée
{
  "data": [...],
  "meta": {
    "page": 1,
    "page_size": 25,
    "total": 342,
    "total_pages": 14
  }
}

// Succès — objet unique
{
  "data": { ... }
}

// Erreur
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Le champ email est invalide",
    "details": { "email": ["Format invalide"] }
  }
}
```

### 5.4 Codes d'erreur métier

```
MEMBER_NOT_FOUND
MEMBER_DUPLICATE
GRADE_NOT_FOUND
GRADE_PROMOTION_RULES_NOT_MET
CONTRIBUTION_ALREADY_EXISTS_FOR_PERIOD
IMPORT_FILE_FORMAT_INVALID
IMPORT_FILE_TOO_LARGE
DOCUMENT_EXPORT_IN_PROGRESS
PERMISSION_DENIED
TOKEN_EXPIRED
```

---

## 6. PROJECT STRUCTURE

### 6.1 Repository structure

```
milgest/
├── .github/
│   └── workflows/
│       ├── test.yml          # tests sur PR
│       └── deploy.yml        # deploy sur merge main
├── backend-django/           # Django — data core
│   ├── milgest/
│   │   ├── settings/
│   │   │   ├── base.py
│   │   │   ├── development.py
│   │   │   └── production.py
│   │   ├── urls.py
│   │   └── celery.py
│   ├── apps/
│   │   ├── organizations/    # modèle Organization + multi-tenant
│   │   ├── members/          # Member, MemberGrade, Grade
│   │   ├── contributions/    # Contribution, Donation
│   │   ├── documents/        # Document, DocumentTemplate
│   │   ├── notifications/    # emails, in-app
│   │   └── audit/            # AuditLog
│   ├── tasks/                # Celery tasks
│   │   ├── import_members.py
│   │   ├── generate_pdf.py
│   │   └── send_notifications.py
│   ├── requirements.txt
│   ├── Dockerfile
│   └── manage.py
├── backend-fastapi/          # FastAPI — REST endpoints
│   ├── app/
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── auth/
│   │   │   ├── router.py
│   │   │   └── dependencies.py
│   │   ├── routers/
│   │   │   ├── members.py
│   │   │   ├── contributions.py
│   │   │   ├── donations.py
│   │   │   ├── documents.py
│   │   │   └── stats.py
│   │   ├── schemas/          # Pydantic models
│   │   ├── services/         # business logic
│   │   └── db/               # SQLAlchemy setup (lecture seule du schéma Django)
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/                 # Next.js 14
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── forgot-password/
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx          # dashboard home
│   │   │   ├── members/
│   │   │   │   ├── page.tsx      # liste membres
│   │   │   │   ├── [id]/
│   │   │   │   │   └── page.tsx  # fiche membre
│   │   │   │   └── import/
│   │   │   │       └── page.tsx  # import Excel
│   │   │   ├── contributions/
│   │   │   ├── donations/
│   │   │   ├── documents/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx  # éditeur Tiptap
│   │   │   ├── stats/
│   │   │   └── settings/
│   ├── components/
│   │   ├── ui/               # shadcn/ui components
│   │   ├── members/
│   │   ├── documents/
│   │   ├── charts/
│   │   └── shared/
│   ├── lib/
│   │   ├── api.ts            # TanStack Query hooks
│   │   ├── auth.ts
│   │   └── utils.ts
│   └── package.json
├── docker-compose.yml        # dev local
└── README.md
```

---

## 7. ENVIRONMENT VARIABLES

### 7.1 Django (backend-django)

```env
# Django
DJANGO_SECRET_KEY=
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=

# Database
DATABASE_URL=postgresql://user:pass@host/milgest

# Redis
REDIS_URL=redis://...

# Celery
CELERY_BROKER_URL=redis://...
CELERY_RESULT_BACKEND=redis://...

# Storage (Cloudflare R2)
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=milgest-files
R2_PUBLIC_URL=

# Email (Resend)
RESEND_API_KEY=
DEFAULT_FROM_EMAIL=noreply@milgest.app

# JWT
JWT_SECRET_KEY=
JWT_ACCESS_TOKEN_EXPIRY=900        # 15 minutes
JWT_REFRESH_TOKEN_EXPIRY=604800    # 7 jours
```

### 7.2 FastAPI (backend-fastapi)

```env
DATABASE_URL=postgresql://user:pass@host/milgest
DJANGO_JWT_SECRET_KEY=             # même clé que Django pour valider les tokens
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=milgest-files
CELERY_BROKER_URL=redis://...
SENTRY_DSN=
```

### 7.3 Frontend (Next.js)

```env
NEXT_PUBLIC_API_URL=https://api.milgest.app
NEXT_PUBLIC_SENTRY_DSN=
```

---

## 8. DEVELOPMENT PHASES

### Phase 1 — MVP (semaines 1-8)

```
Objectif : un outil fonctionnel pour gérer des membres et des cotisations

✅ Auth (login, JWT, RBAC basique)
✅ Gestion des membres (CRUD, liste, recherche, filtres)
✅ Import Excel (upload, mapping, validation, import batch)
✅ Cotisations (enregistrement, historique par membre)
✅ Grades (configuration, assignation manuelle)
✅ Django Admin opérationnel
✅ Dashboard avec KPIs de base (5 metric cards)
✅ Déploiement complet sur stack gratuite
```

### Phase 2 — Core features (semaines 9-16)

```
✅ Éditeur de documents Tiptap + templates
✅ Export PDF avec filigrane configurable
✅ Règles de promotion automatique (moteur de règles)
✅ Dons (enregistrement, reçus)
✅ Reçus PDF (cotisations + dons)
✅ Notifications email (relances cotisations, promotions)
✅ Graphiques dynamiques (tous les 7 graphiques)
✅ Filtres globaux dashboard
✅ Export des données filtrées (CSV, Excel)
```

### Phase 3 — Polish & Scale (semaines 17+)

```
⬜ Multi-organisation (django-tenants complet)
⬜ WebSockets (dashboard live, notifications in-app)
⬜ API mobile (react-native / PWA)
⬜ Intégration paiement (Mobile Money, CinetPay)
⬜ Rapport PDF du dashboard complet
⬜ Graphique Sankey flux de promotions
⬜ SSO (OAuth2 Google)
⬜ Backup automatique et restauration
```

---

## 9. NON-FUNCTIONAL REQUIREMENTS

### 9.1 Performance

```
- Liste de membres : < 500ms pour 10 000 membres avec filtres
- Import Excel : traitement async, résultat en < 2min pour 1000 lignes
- Génération PDF : < 10s pour un document standard
- Dashboard stats : < 1s avec cache Redis (TTL 5min)
- API endpoints : p95 < 200ms
```

### 9.2 Sécurité

```
- Toutes les communications en HTTPS
- Tokens JWT avec expiry court (15min access)
- Rate limiting sur les endpoints d'auth
- Soft delete uniquement (pas de suppression physique)
- Audit log de toutes les mutations critiques
- Chiffrement au repos pour les données sensibles (PII)
- CORS configuré strictement (origines whitelist seulement)
```

### 9.3 Accessibilité & UX

```
- Interface responsive (desktop prioritaire, tablet acceptable)
- Langue de l'interface : français
- Feedback visuel sur toutes les actions async (loaders, toasts)
- Messages d'erreur en français, compréhensibles pour un non-technicien
- Confirmation obligatoire avant suppression ou action irréversible
```

---

## 10. GLOSSARY

```
Organisation  : entité utilisatrice de Milgest (parti politique, association, ONG)
Militant      : membre d'une organisation enregistré dans Milgest
Grade         : niveau hiérarchique d'un militant au sein de l'organisation
Cotisation    : paiement périodique d'un militant pour maintenir son adhésion
Don           : contribution financière volontaire (membre ou externe)
Filigrane     : texte ou logo imprimé en transparence sur les documents exportés
Template      : modèle de document réutilisable avec variables dynamiques
Variable      : placeholder {{nom}} remplacé par la valeur réelle lors du rendu
Promotion     : passage d'un militant à un grade supérieur
Tenant        : organisation isolée dans son propre schema PostgreSQL
```

---

_Milgest PRD v1.0 — Généré pour utilisation avec Cursor AI_
_Ce document est le source of truth pour le développement — toute décision technique doit être cohérente avec ce PRD._
