# ⚙️ Procédures Techniques - Documentation Détaillée

**Version :** 1.0  
**Auteur :** Assia Kamoune  
**Date :** Mai 2026  
**Public :** Développeurs, data engineers, consultants techniques

---

## Table des matières

1. [Architecture Générale](#architecture-générale)
2. [Pipeline de Données](#pipeline-de-données)
3. [Base de Données](#base-de-données)
4. [Requêtes SQL](#requêtes-sql)
5. [Code Python](#code-python)
6. [Configuration Power BI](#configuration-power-bi)
7. [Refresh et Automatisation](#refresh-et-automatisation)
8. [Sécurité et Conformité](#sécurité-et-conformité)
9. [Monitoring et Logs](#monitoring-et-logs)

---

## 🏗️ Architecture Générale

### Vue d'Ensemble

```
┌─────────────────────────────────────────────────────────┐
│                    SOURCES DE DONNÉES                    │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐
│  │ Base données │  │ CSV/Excel    │  │ APIs Externes   │
│  │ Production   │  │ (CRM, RH)    │  │ (LinkedIn, etc) │
│  └──────────────┘  └──────────────┘  └─────────────────┘
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                  COUCHE EXTRACTION (ETL)                 │
│              ┌──────────────────────────┐                │
│              │    Python + Pandas       │                │
│              │  - Extraction données    │                │
│              │  - Validation format     │                │
│              │  - Audit trails          │                │
│              └──────────────────────────┘                │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                COUCHE TRANSFORMATION                     │
│         ┌─────────────────────────────────────┐          │
│         │      Python + Pandas/NumPy          │          │
│         │  - Nettoyage données                │          │
│         │  - Feature engineering              │          │
│         │  - Agrégations, joins               │          │
│         │  - Modélisation RFM                 │          │
│         └─────────────────────────────────────┘          │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                  DATA WAREHOUSE                          │
│   ┌─────────────────────────────────────────────────┐   │
│   │  PostgreSQL / MySQL                             │   │
│   │  - Tables factuelles (Facts)                    │   │
│   │  - Tables dimensions (Dimensions)              │   │
│   │  - Indexes optimisés                           │   │
│   └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│              COUCHE VISUALISATION (BI)                   │
│         ┌──────────────┐      ┌─────────────────┐        │
│         │  Power BI    │      │  Tableau/Looker │        │
│         │  - TB_Profil │      │  (Optionnel)    │        │
│         │  - TB_Veille │      │                 │        │
│         └──────────────┘      └─────────────────┘        │
└─────────────────────────────────────────────────────────┘
```

### Composants Clés

| Composant | Technologie | Rôle |
|-----------|-------------|------|
| **Source données** | PostgreSQL 12+ | Base de données production |
| **Extraction** | Python 3.8+ | Récupération données brutes |
| **Transformation** | Pandas, NumPy | Nettoyage & feature engineering |
| **Stockage** | PostgreSQL DW | Entrepôt de données optimisé |
| **Visualisation** | Power BI Desktop | Dashboards interactifs |
| **Versioning** | Git/GitHub | Contrôle de version code |

---

## 📊 Pipeline de Données

### Flux Complet

```
JOUR 1 : EXTRACTION
├─ 09:00 - Déclencher script Python
├─ 09:05 - Connexion à PostgreSQL source
├─ 09:10 - Récupérer données 7 derniers jours
├─ 09:15 - Validation format + contrôles qualité
└─ 09:20 - Export fichiers CSV staging

JOUR 1 : TRANSFORMATION
├─ 10:00 - Charger CSVs en mémoire (Pandas)
├─ 10:05 - Nettoyage (doublons, NaN, outliers)
├─ 10:15 - Feature engineering (calculs dérivés)
├─ 10:30 - Agrégations par domaine
└─ 10:45 - Validation output (tests)

JOUR 1 : CHARGEMENT
├─ 11:00 - Connexion PostgreSQL DW
├─ 11:05 - Truncate tables (nouvelle extraction)
├─ 11:10 - Insert données transformées
├─ 11:20 - Refresh indexes + statistiques
└─ 11:25 - Audit trail (logs chargement)

JOUR 2 : VISUALISATION
├─ 08:00 - Power BI détecte nouvelles données
├─ 08:05 - Refresh modèle de données
├─ 08:10 - Tableaux recalculent measures
└─ 08:15 - Users voient données mises à jour
```

### Fréquence Refresh

```
TB_Profil
├─ Données statiques (expérience historique)
├─ Refresh : 1x par mois (manuel)
└─ Trigger : Mise à jour CV

TB_Veille
├─ Données dynamiques (articles, tendances)
├─ Refresh : Quotidien (09h00)
└─ Trigger : Scraping automatique
```

---

## 💾 Base de Données

### Schéma PostgreSQL

#### Table 1 : `dim_competences`
```sql
CREATE TABLE dim_competences (
    competence_id SERIAL PRIMARY KEY,
    competence_nom VARCHAR(100) NOT NULL UNIQUE,
    categorie VARCHAR(50),           -- 'Langage', 'BI', 'Outil'
    niveau_maitrise INT,              -- 60-100%
    date_apprentissage DATE,
    source_apprentissage VARCHAR(200), -- 'Formation', 'Projet', 'Autodidacte'
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Index pour recherches rapides
CREATE INDEX idx_competences_categorie ON dim_competences(categorie);
```

**Exemple données :**
```
| competence_id | competence_nom | categorie | niveau_maitrise | source |
|---------------|----------------|-----------|-----------------|--------|
| 1             | SQL            | Langage   | 90              | Projet |
| 2             | Python         | Langage   | 75              | Cours  |
| 3             | Power BI       | BI        | 90              | Projet |
| 4             | Excel Avancé   | Outil     | 85              | Formation |
```

#### Table 2 : `dim_emplois`
```sql
CREATE TABLE dim_emplois (
    emploi_id SERIAL PRIMARY KEY,
    entreprise VARCHAR(100) NOT NULL,
    poste VARCHAR(100) NOT NULL,
    date_debut DATE NOT NULL,
    date_fin DATE,
    description TEXT,
    achievements TEXT[],  -- Array de réalisations
    created_at TIMESTAMP DEFAULT NOW()
);

-- Exemple données
INSERT INTO dim_emplois VALUES (
    1,
    'AttijariWafa Bank',
    'Conseillère Clientèle Professionnels',
    '2019-03-01',
    '2024-12-31',
    'Gestion portefeuille clients PME',
    ARRAY['+27% croissance portefeuille', '+20% satisfaction client']
);
```

#### Table 3 : `fact_projets`
```sql
CREATE TABLE fact_projets (
    projet_id SERIAL PRIMARY KEY,
    projet_nom VARCHAR(150) NOT NULL,
    description TEXT,
    categorie VARCHAR(50),           -- 'EDA', 'SQL', 'Dashboard'
    competences_utilisees INT[],     -- Références dim_competences
    technologies VARCHAR[],           -- ['Python', 'Pandas', 'NumPy']
    resultat_mesurable TEXT,         -- 'ROI +35%'
    date_debut DATE,
    date_fin DATE,
    duree_jours INT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### Table 4 : `dim_articles_veille`
```sql
CREATE TABLE dim_articles_veille (
    article_id SERIAL PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    description TEXT,
    categorie VARCHAR(50),            -- 'BI', 'ML', 'Cloud', 'Métho'
    source VARCHAR(100),              -- 'LinkedIn', 'Medium', 'GitHub'
    url VARCHAR(500) UNIQUE,
    date_publication DATE,
    tags VARCHAR[],                   -- ['Power BI', 'Dashboard', 'RLS']
    pertinence INT,                   -- 1-5 (utile pour tri)
    archivé BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Index pour filtrage rapide
CREATE INDEX idx_articles_categorie ON dim_articles_veille(categorie);
CREATE INDEX idx_articles_date ON dim_articles_veille(date_publication DESC);
```

### Modèle Relationnel

```
dim_competences (1) ──────┐
                          │
                    (N) fact_projets (utilise)

dim_emplois (1) ──────┐
                      │
                  fact_projets (réalisé pendant)

dim_articles_veille (1) ──────┐
                              │
                         (N) fact_projets (référence)
```

---

## 🔍 Requêtes SQL

### Requête 1 : Compétences par Projet

```sql
-- Afficher toutes compétences utilisées dans les projets
SELECT 
    p.projet_nom,
    STRING_AGG(c.competence_nom, ', ') as competences,
    COUNT(c.competence_id) as nombre_competences,
    AVG(c.niveau_maitrise) as niveau_moyen
FROM fact_projets p
JOIN dim_competences c ON c.competence_id = ANY(p.competences_utilisees)
GROUP BY p.projet_nom
ORDER BY nombre_competences DESC;

-- Output :
-- | projet_nom           | competences              | nombre | niveau_moyen |
-- |----------------------|--------------------------|--------|--------------|
-- | Tableau Veille       | SQL, Power BI, DAX       | 3      | 85           |
-- | Segmentation RFM     | SQL, Python, Excel       | 3      | 80           |
-- | EDA Exploratoire     | Python, Pandas, NumPy    | 3      | 75           |
```

### Requête 2 : Articles Populaires par Domaine

```sql
-- Top 5 articles les plus pertinents par domaine
WITH ranked_articles AS (
    SELECT 
        article_id,
        titre,
        categorie,
        pertinence,
        ROW_NUMBER() OVER (PARTITION BY categorie ORDER BY pertinence DESC) as rang
    FROM dim_articles_veille
    WHERE archivé = FALSE
)
SELECT 
    categorie,
    titre,
    pertinence
FROM ranked_articles
WHERE rang <= 5
ORDER BY categorie, pertinence DESC;
```

### Requête 3 : Évolution Compétences par Projet

```sql
-- Analyser comment compétences évoluent au fil des projets
SELECT 
    c.competence_nom,
    COUNT(DISTINCT p.projet_id) as nb_projets_utilisation,
    MIN(p.date_debut) as premiere_utilisation,
    MAX(p.date_fin) as derniere_utilisation,
    EXTRACT(YEAR FROM MAX(p.date_fin)) - EXTRACT(YEAR FROM MIN(p.date_debut)) as annees_pratique
FROM fact_projets p
JOIN dim_competences c ON c.competence_id = ANY(p.competences_utilisees)
GROUP BY c.competence_nom
HAVING COUNT(DISTINCT p.projet_id) >= 2  -- Au moins 2 projets
ORDER BY annees_pratique DESC;
```

### Requête 4 : Veille Technologique Récente

```sql
-- Articles publiés dans les 30 derniers jours
SELECT 
    titre,
    categorie,
    source,
    DATE_TRUNC('day', date_publication) as date_pub,
    url,
    tags
FROM dim_articles_veille
WHERE date_publication >= CURRENT_DATE - INTERVAL '30 days'
  AND archivé = FALSE
ORDER BY date_publication DESC
LIMIT 20;
```

### Requête 5 : Projets par Compétence

```sql
-- Pour chaque compétence, lister projets où elle a été utilisée
SELECT 
    c.competence_nom,
    c.niveau_maitrise,
    p.projet_nom,
    p.categorie,
    p.resultat_mesurable,
    p.date_fin
FROM dim_competences c
LEFT JOIN fact_projets p ON c.competence_id = ANY(p.competences_utilisees)
WHERE c.categorie IN ('Langage', 'BI')
ORDER BY c.competence_nom, p.date_fin DESC;
```

### Requête 6 : Croissance Compétences (Analytics)

```sql
-- Calculer progression niveau maîtrise par année
WITH competences_par_annee AS (
    SELECT 
        c.competence_nom,
        EXTRACT(YEAR FROM p.date_fin) as annee,
        MAX(c.niveau_maitrise) as niveau_max
    FROM fact_projets p
    JOIN dim_competences c ON c.competence_id = ANY(p.competences_utilisees)
    WHERE p.date_fin IS NOT NULL
    GROUP BY c.competence_nom, annee
)
SELECT 
    competence_nom,
    annee,
    niveau_max,
    LAG(niveau_max) OVER (PARTITION BY competence_nom ORDER BY annee) as niveau_precedent,
    niveau_max - LAG(niveau_max) OVER (PARTITION BY competence_nom ORDER BY annee) as progression
FROM competences_par_annee
ORDER BY competence_nom, annee;
```

---

## 🐍 Code Python

### Setup Environnement

```python
# requirements.txt
pandas==2.0.0
numpy==1.24.0
psycopg2-binary==2.9.0
sqlalchemy==2.0.0
python-dotenv==1.0.0
```

```bash
# Installation
pip install -r requirements.txt
```

### 1. Extraction Données

```python
import pandas as pd
import psycopg2
from sqlalchemy import create_engine
import logging
from datetime import datetime, timedelta

# Configuration logging
logging.basicConfig(
    filename='extraction.log',
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

class DataExtractor:
    def __init__(self, host, database, user, password):
        """Initialiser connecteur PostgreSQL"""
        self.connection_string = f'postgresql://{user}:{password}@{host}:5432/{database}'
        self.engine = create_engine(self.connection_string)
        logging.info(f'Connexion établie à {host}/{database}')
    
    def extract_competences(self):
        """Extraire données compétences"""
        query = """
        SELECT 
            competence_id, 
            competence_nom, 
            categorie, 
            niveau_maitrise
        FROM dim_competences
        ORDER BY categorie, competence_nom
        """
        
        try:
            df = pd.read_sql(query, self.engine)
            logging.info(f'✓ {len(df)} compétences extraites')
            return df
        except Exception as e:
            logging.error(f'✗ Erreur extraction compétences: {str(e)}')
            raise
    
    def extract_articles(self, days=30):
        """Extraire articles publiés dans X derniers jours"""
        query = f"""
        SELECT 
            article_id,
            titre,
            description,
            categorie,
            source,
            url,
            date_publication,
            tags,
            pertinence
        FROM dim_articles_veille
        WHERE date_publication >= CURRENT_DATE - INTERVAL '{days} days'
          AND archivé = FALSE
        ORDER BY date_publication DESC
        """
        
        try:
            df = pd.read_sql(query, self.engine)
            logging.info(f'✓ {len(df)} articles extraits (derniers {days} jours)')
            return df
        except Exception as e:
            logging.error(f'✗ Erreur extraction articles: {str(e)}')
            raise

# Utilisation
extractor = DataExtractor(
    host='localhost',
    database='portfolio_db',
    user='assia',
    password='secure_password'
)

competences_df = extractor.extract_competences()
articles_df = extractor.extract_articles(days=30)
```

### 2. Transformation Données

```python
import pandas as pd
import numpy as np

class DataTransformer:
    
    @staticmethod
    def clean_competences(df):
        """Nettoyer données compétences"""
        # Supprimer doublons
        df = df.drop_duplicates(subset=['competence_id'])
        
        # Remplir valeurs manquantes
        df['niveau_maitrise'] = df['niveau_maitrise'].fillna(0)
        df['categorie'] = df['categorie'].fillna('Autre')
        
        # Valider plages
        df['niveau_maitrise'] = df['niveau_maitrise'].clip(0, 100)
        
        # Ajouter label niveau
        df['label_niveau'] = pd.cut(
            df['niveau_maitrise'],
            bins=[0, 60, 75, 90, 100],
            labels=['Basique', 'Intermédiaire', 'Avancé', 'Expert']
        )
        
        logging.info(f'✓ Données compétences nettoyées ({len(df)} records)')
        return df
    
    @staticmethod
    def create_rfm_model(projets_df):
        """Créer modèle RFM pour projets"""
        # Recency : Jours depuis dernier projet
        projets_df['recency'] = (pd.Timestamp.now() - projets_df['date_fin']).dt.days
        
        # Frequency : Nombre projets par année
        projets_df['year'] = projets_df['date_fin'].dt.year
        frequency = projets_df.groupby('year').size()
        projets_df = projets_df.merge(
            frequency.reset_index().rename(columns={0: 'frequency'}),
            left_on='year',
            right_on='year'
        )
        
        # Monetary : Complexité (nombre compétences utilisées)
        projets_df['complexity'] = projets_df['competences_utilisees'].apply(len)
        
        # Score RFM (0-100)
        projets_df['rfm_score'] = (
            (100 - projets_df['recency'].rank(pct=True)*100) * 0.33 +  # Recency
            (projets_df['frequency'].rank(pct=True)*100) * 0.33 +        # Frequency
            (projets_df['complexity'].rank(pct=True)*100) * 0.34         # Complexity
        ).round(0)
        
        return projets_df
    
    @staticmethod
    def categorize_articles(articles_df):
        """Catégoriser articles automatiquement"""
        keywords = {
            'BI': ['power bi', 'tableau', 'looker', 'dashboard', 'bi'],
            'ML': ['machine learning', 'ml', 'ai', 'neural', 'model'],
            'Cloud': ['aws', 'azure', 'gcp', 'cloud', 'databricks'],
            'Métho': ['agile', 'dataops', 'methodology', 'process']
        }
        
        def assign_category(text):
            text_lower = text.lower()
            for category, words in keywords.items():
                if any(word in text_lower for word in words):
                    return category
            return 'Autre'
        
        articles_df['categorie_auto'] = articles_df['titre'].apply(assign_category)
        
        return articles_df

# Utilisation
transformer = DataTransformer()

competences_clean = transformer.clean_competences(competences_df)
projets_rfm = transformer.create_rfm_model(projets_df)
articles_categorized = transformer.categorize_articles(articles_df)

logging.info('✓ Transformations complétées')
```

### 3. Chargement Données

```python
class DataLoader:
    def __init__(self, engine):
        self.engine = engine
    
    def load_competences(self, df):
        """Charger compétences dans DW"""
        try:
            # Truncate table
            with self.engine.connect() as conn:
                conn.execute("TRUNCATE TABLE dim_competences")
                conn.commit()
            
            # Insert data
            df.to_sql('dim_competences', self.engine, if_exists='append', index=False)
            logging.info(f'✓ {len(df)} compétences chargées')
            
        except Exception as e:
            logging.error(f'✗ Erreur chargement compétences: {str(e)}')
            raise
    
    def load_articles(self, df):
        """Charger articles dans DW"""
        try:
            df.to_sql('dim_articles_veille', self.engine, if_exists='append', index=False)
            logging.info(f'✓ {len(df)} articles chargés')
        except Exception as e:
            logging.error(f'✗ Erreur chargement articles: {str(e)}')
            raise

# Pipeline complet
def main():
    logging.info('=' * 50)
    logging.info('PIPELINE DONNÉES - DÉMARRAGE')
    logging.info('=' * 50)
    
    # Extraction
    extractor = DataExtractor('localhost', 'portfolio_db', 'assia', 'password')
    competences = extractor.extract_competences()
    articles = extractor.extract_articles(30)
    
    # Transformation
    transformer = DataTransformer()
    competences_clean = transformer.clean_competences(competences)
    articles_cat = transformer.categorize_articles(articles)
    
    # Chargement
    loader = DataLoader(extractor.engine)
    loader.load_competences(competences_clean)
    loader.load_articles(articles_cat)
    
    logging.info('=' * 50)
    logging.info('PIPELINE DONNÉES - SUCCÈS')
    logging.info('=' * 50)

if __name__ == '__main__':
    main()
```

---

## 📊 Configuration Power BI

### TB_Profil - Modèle Données

```
TABLES IMPORTÉES :
├─ dim_competences
│   ├─ competence_id (PK)
│   ├─ competence_nom
│   ├─ categorie
│   └─ niveau_maitrise
│
├─ fact_projets
│   ├─ projet_id (PK)
│   ├─ projet_nom
│   ├─ competences_utilisees (FK)
│   └─ resultat_mesurable
│
└─ dim_emplois
    ├─ emploi_id (PK)
    ├─ entreprise
    └─ achievements

RELATIONS :
dim_competences.competence_id → fact_projets.competences_utilisees (1:N)
dim_emplois.emploi_id → fact_projets.emploi_id (1:N)
```

### TB_Profil - Mesures (DAX)

```dax
-- Mesure 1 : Nombre Total Projets
Total Projets = COUNTA(fact_projets[projet_id])

-- Mesure 2 : Niveau Moyen Compétences
Niveau Moyen = AVERAGE(dim_competences[niveau_maitrise])

-- Mesure 3 : Années Expérience
Annees Experience = 
    DATEDIFF(
        MIN(dim_emplois[date_debut]),
        MAX(dim_emplois[date_fin]),
        YEAR
    )

-- Mesure 4 : Compétences Master (90%+)
Competences Master = 
    CALCULATE(
        COUNTA(dim_competences[competence_id]),
        FILTER(dim_competences, dim_competences[niveau_maitrise] >= 90)
    )

-- Mesure 5 : Résultats Mesurables
Resultats Clés = COUNTA(fact_projets[resultat_mesurable])
```

### TB_Profil - Visualisations

```
PAGE 1 : OVERVIEW
├─ Card : Total Projets (4)
├─ Card : Expérience (5+ ans)
├─ Card : Compétences Master (3)
└─ Card : Disponibilité (Immédiate)

PAGE 2 : COMPETENCES
├─ Clustered Bar : Niveau par Compétence
├─ Pie : Répartition Catégories (Langage, BI, Outils)
└─ Table : Détails Compétences

PAGE 3 : EXPERIENCE
├─ Timeline : Parcours Professionnel
└─ Table : Réalisations par Emploi

PAGE 4 : PROJETS
├─ Card : Nombre Projets Total
├─ Matrix : Projets × Compétences
└─ Card : Impact Moyen
```

### TB_Veille - Modèle Données

```
TABLE :
dim_articles_veille
├─ article_id (PK)
├─ titre
├─ categorie
├─ source
├─ date_publication
├─ pertinence
└─ tags
```

### TB_Veille - Visualisations

```
PAGE 1 : OVERVIEW
├─ Card : Articles (7 jours) = ?
├─ Card : Tendance Top = ?
├─ KPI : % Croissance Articles
└─ Gauge : Pertinence Moyenne

PAGE 2 : ARTICLE TRENDS
├─ Line Chart : Articles par Jour
├─ Donut : Répartition par Catégorie
└─ Stacked Bar : Source × Catégorie

PAGE 3 : ARTICLE LISTING
└─ Table : Titre | Catégorie | Source | Date | Lien

PAGE 4 : SOURCE ANALYSIS
├─ Heatmap : Source × Mois
└─ Scatter : Pertinence vs Récence
```

---

## 🔄 Refresh et Automatisation

### Scheduled Refresh (Power BI Service)

```
TB_Profil :
├─ Type : Manuel (mise à jour CV)
├─ Fréquence : 1x par mois
└─ Trigger : Email notification

TB_Veille :
├─ Type : Automatisé
├─ Fréquence : Quotidienne 09:00
├─ Email notification : Nouvel articles
└─ Logs : refresh_logs.csv
```

### Script Automatisation (Python/Cron)

```bash
# crontab -e

# Refresh quotidien TB_Veille (09:00)
0 9 * * * /usr/bin/python3 /home/assia/portfolio/refresh_veille.py

# Backup données (dimanche 02:00)
0 2 * * 0 /usr/bin/python3 /home/assia/portfolio/backup_data.py

# Rapport hebdo (vendredi 17:00)
0 17 * * 5 /usr/bin/python3 /home/assia/portfolio/generate_report.py
```

---

## 🔒 Sécurité et Conformité

### Sécurité Données

**Authentication :**
```python
# .env file
DB_USER=assia
DB_PASSWORD=secure_hash_password_128_char_min
DB_HOST=localhost
DB_PORT=5432
```

**Connexion Sécurisée :**
```python
from sqlalchemy import create_engine
from dotenv import load_dotenv
import os

load_dotenv()

# SSL Connection
engine = create_engine(
    f"postgresql://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}@{os.getenv('DB_HOST')}/portfolio_db",
    connect_args={"sslmode": "require"}
)
```

### Conformité RGPD

**Anonymisation :**
```python
def anonymize_emails(df):
    """Masquer emails dans exports"""
    df['email'] = df['email'].str.replace(r'@.*', '@***', regex=True)
    return df

def gdpr_audit_trail(action, user, timestamp):
    """Enregistrer actions pour audit"""
    audit = {
        'action': action,
        'user': user,
        'timestamp': timestamp,
        'ip_address': get_client_ip()
    }
    # Sauvegarder dans log sécurisé
```

---

## 📊 Monitoring et Logs

### Fichiers Logs

```
logs/
├─ extraction.log          # Extraction données
├─ transformation.log      # Transformations
├─ loading.log            # Chargement DW
├─ refresh.log            # Refresh Power BI
└─ audit_trail.log        # Actions utilisateur
```

### Exemple Log Entry

```
2026-05-22 09:15:32 - INFO - Extraction démarrée
2026-05-22 09:16:12 - INFO - ✓ 15 compétences extraites
2026-05-22 09:16:45 - INFO - ✓ 342 articles extraits
2026-05-22 09:17:20 - INFO - Transformation démarrée
2026-05-22 09:18:30 - INFO - ✓ Données nettoyées et validées
2026-05-22 09:19:45 - INFO - ✓ 342 articles chargés en DW
2026-05-22 09:20:00 - INFO - ✓ Pipeline complété avec succès
```

---

## 📞 Support Technique

Pour problèmes ou questions techniques :

📧 assia.kamoune@gmail.com  
💼 linkedin.com/in/AssiaKamoune

---

**Version :** 1.0 | **Dernière mise à jour :** Mai 2026 | **Status :** ✅ À jour

