import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
import os

class MLService:
    def __init__(self):
        self.lead_model = None
        self.churn_model = None
        self.is_trained = False

    def train_lead_model(self, df: pd.DataFrame):
        """Entrena modelo de conversión de leads."""
        df['compro_target'] = df['compro'].apply(lambda x: 1 if x == 'Sí' else 0)
        
        X = df[['urgencia_compra', 'horas_hasta_contacto', 'intentos_contacto', 'fuente_meta', 'industria']]
        y = df['compro_target']

        numeric_features = ['urgencia_compra', 'horas_hasta_contacto', 'intentos_contacto']
        categorical_features = ['fuente_meta', 'industria']

        numeric_transformer = Pipeline(steps=[
            ('imputer', SimpleImputer(strategy='median')),
            ('scaler', StandardScaler())
        ])

        categorical_transformer = Pipeline(steps=[
            ('imputer', SimpleImputer(strategy='constant', fill_value='missing')),
            ('onehot', OneHotEncoder(handle_unknown='ignore'))
        ])

        preprocessor = ColumnTransformer(
            transformers=[
                ('num', numeric_transformer, numeric_features),
                ('cat', categorical_transformer, categorical_features)
            ])

        self.lead_model = Pipeline(steps=[('preprocessor', preprocessor),
                                          ('classifier', RandomForestClassifier(n_estimators=100, random_state=42))])
        self.lead_model.fit(X, y)
        print("Modelo de Leads entrenado.")

    def train_churn_model(self, df: pd.DataFrame):
        """Entrena modelo de churn."""
        df['churn_target'] = ((df['satisfaccion'] <= 2) | (df['dias_desde_ultima_compra'] > 90)).astype(int)
        
        X = df[['frecuencia_compra', 'engagement', 'satisfaccion', 'dias_desde_ultima_compra', 'valor_historico']]
        y = df['churn_target']

        numeric_features = ['frecuencia_compra', 'engagement', 'satisfaccion', 'dias_desde_ultima_compra', 'valor_historico']
        
        numeric_transformer = Pipeline(steps=[
            ('imputer', SimpleImputer(strategy='median')),
            ('scaler', StandardScaler())
        ])

        preprocessor = ColumnTransformer(
            transformers=[
                ('num', numeric_transformer, numeric_features)
            ])

        self.churn_model = Pipeline(steps=[('preprocessor', preprocessor),
                                           ('classifier', RandomForestClassifier(n_estimators=100, random_state=42))])
        self.churn_model.fit(X, y)
        print("Modelo de Churn entrenado.")
        self.is_trained = True

    def predict_lead_score(self, data: dict):
        if not self.lead_model:
            return 50, "Tibio"
            
        df = pd.DataFrame([data])
        try:
            prob = self.lead_model.predict_proba(df)[0][1]
            score = int(prob * 100)
            
            if score >= 70:
                clasif = "Caliente"
            elif score >= 40:
                clasif = "Tibio"
            else:
                clasif = "Frío"
                
            return score, clasif
        except Exception as e:
            print(f"Error predicción lead: {e}")
            return 50, "Tibio"

    def predict_churn_risk(self, row_data: dict):
        if not self.churn_model:
            return 0.0
            
        df = pd.DataFrame([row_data])
        try:
            prob = self.churn_model.predict_proba(df)[0][1]
            return prob
        except Exception as e:
            print(f"Error predicción churn: {e}")
            return 0.0

ml_service = MLService()
