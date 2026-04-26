"""initial schema

Revision ID: 0001
Revises:
Create Date: 2024-01-01 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = "0001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # users
    op.create_table(
        "users",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("email", sa.String(255), nullable=False),
        sa.Column("password_hash", sa.String(255), nullable=False),
        sa.Column("full_name", sa.String(255), nullable=False),
        sa.Column("role", sa.String(20), nullable=False, server_default="user"),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default="true"),
        sa.Column("gdpr_consented_at", sa.DateTime(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
    )
    op.create_index("ix_users_email", "users", ["email"], unique=True)

    # sessions
    op.create_table(
        "sessions",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("refresh_token_hash", sa.String(255), nullable=False, unique=True),
        sa.Column("expires_at", sa.DateTime(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("ip_address", sa.String(45), nullable=True),
        sa.Column("user_agent", sa.String(500), nullable=True),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
    )

    # applications
    op.create_table(
        "applications",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("status", sa.String(20), nullable=False, server_default="pending"),
        sa.Column("payment_history_pct", sa.Float(), nullable=True),
        sa.Column("amounts_owed", sa.Float(), nullable=True),
        sa.Column("credit_utilization_ratio", sa.Float(), nullable=True),
        sa.Column("credit_length_months", sa.Integer(), nullable=True),
        sa.Column("new_inquiries_6m", sa.Integer(), nullable=True),
        sa.Column("credit_mix_count", sa.Integer(), nullable=True),
        sa.Column("annual_income", sa.Float(), nullable=True),
        sa.Column("employment_status", sa.String(50), nullable=True),
        sa.Column("zip_code", sa.String(10), nullable=True),
        sa.Column("age", sa.Integer(), nullable=True),
        sa.Column("has_alt_data", sa.Boolean(), nullable=False, server_default="false"),
        sa.Column("mobile_usage_score", sa.Float(), nullable=True),
        sa.Column("utility_payment_ratio", sa.Float(), nullable=True),
        sa.Column("rental_history_months", sa.Integer(), nullable=True),
        sa.Column("digital_payment_frequency", sa.Float(), nullable=True),
        sa.Column("financial_narrative_text", sa.Text(), nullable=True),
        sa.Column("gender", sa.String(20), nullable=True),
        sa.Column("ethnicity", sa.String(50), nullable=True),
        sa.Column("demographic_consented", sa.Boolean(), nullable=False, server_default="false"),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
    )

    # scores
    op.create_table(
        "scores",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("application_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("model_version", sa.String(50), nullable=False),
        sa.Column("score", sa.Integer(), nullable=False),
        sa.Column("probability_of_default", sa.Float(), nullable=False),
        sa.Column("risk_tier", sa.String(20), nullable=False),
        sa.Column("confidence_lower", sa.Float(), nullable=True),
        sa.Column("confidence_upper", sa.Float(), nullable=True),
        sa.Column("used_alt_data", sa.Boolean(), nullable=False, server_default="false"),
        sa.Column("used_nlp", sa.Boolean(), nullable=False, server_default="false"),
        sa.Column("computation_ms", sa.Integer(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(["application_id"], ["applications.id"]),
    )

    # shap_values
    op.create_table(
        "shap_values",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("score_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("feature_name", sa.String(100), nullable=False),
        sa.Column("feature_value", sa.Float(), nullable=True),
        sa.Column("shap_value", sa.Float(), nullable=False),
        sa.Column("rank", sa.Integer(), nullable=False),
        sa.Column("direction", sa.String(10), nullable=False),
        sa.ForeignKeyConstraint(["score_id"], ["scores.id"]),
    )

    # fairness_reports
    op.create_table(
        "fairness_reports",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("score_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("model_version", sa.String(50), nullable=False),
        sa.Column("demographic_parity_diff", sa.Float(), nullable=True),
        sa.Column("equalized_odds_diff", sa.Float(), nullable=True),
        sa.Column("disparate_impact_ratio", sa.Float(), nullable=True),
        sa.Column("statistical_parity_diff", sa.Float(), nullable=True),
        sa.Column("equal_opportunity_diff", sa.Float(), nullable=True),
        sa.Column("flags", postgresql.JSON(), nullable=False, server_default="{}"),
        sa.Column("passed_regulatory_threshold", sa.Boolean(), nullable=False, server_default="true"),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(["score_id"], ["scores.id"]),
    )

    # drift_reports
    op.create_table(
        "drift_reports",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("model_version", sa.String(50), nullable=False),
        sa.Column("report_date", sa.DateTime(), nullable=False),
        sa.Column("psi_scores", postgresql.JSON(), nullable=False),
        sa.Column("ks_results", postgresql.JSON(), nullable=False),
        sa.Column("drift_detected", sa.Boolean(), nullable=False, server_default="false"),
        sa.Column(
            "features_drifted",
            postgresql.ARRAY(sa.String()),
            nullable=False,
            server_default="{}",
        ),
        sa.Column("auc_at_report", sa.Float(), nullable=True),
        sa.Column("retrain_triggered", sa.Boolean(), nullable=False, server_default="false"),
    )

    # model_registry
    op.create_table(
        "model_registry",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("version", sa.String(20), nullable=False, unique=True),
        sa.Column("algorithm", sa.String(50), nullable=False),
        sa.Column("dataset", sa.String(100), nullable=False),
        sa.Column("auc_roc", sa.Float(), nullable=False),
        sa.Column("f1_score", sa.Float(), nullable=False),
        sa.Column("gini_coefficient", sa.Float(), nullable=False),
        sa.Column("accuracy", sa.Float(), nullable=False),
        sa.Column("train_date", sa.DateTime(), nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default="false"),
        sa.Column("artifact_path", sa.String(500), nullable=False),
        sa.Column("parameters", postgresql.JSON(), nullable=False, server_default="{}"),
        sa.Column("fairness_baseline", postgresql.JSON(), nullable=False, server_default="{}"),
        sa.Column("training_samples", sa.Integer(), nullable=True),
    )

    # audit_log
    op.create_table(
        "audit_log",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("action", sa.String(100), nullable=False),
        sa.Column("application_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("model_version", sa.String(50), nullable=True),
        sa.Column("timestamp", sa.DateTime(), nullable=False, index=True),
        sa.Column("ip_address", sa.String(45), nullable=True),
        sa.Column("metadata", postgresql.JSON(), nullable=False, server_default="{}"),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"]),
    )
    op.create_index("ix_audit_log_timestamp", "audit_log", ["timestamp"])

    # alternative_data
    op.create_table(
        "alternative_data",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("application_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("source_type", sa.String(50), nullable=False),
        sa.Column("raw_score", sa.Float(), nullable=False),
        sa.Column("normalized_score", sa.Float(), nullable=False),
        sa.Column("confidence", sa.Float(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(["application_id"], ["applications.id"]),
    )


def downgrade() -> None:
    op.drop_table("alternative_data")
    op.drop_index("ix_audit_log_timestamp", table_name="audit_log")
    op.drop_table("audit_log")
    op.drop_table("model_registry")
    op.drop_table("drift_reports")
    op.drop_table("fairness_reports")
    op.drop_table("shap_values")
    op.drop_table("scores")
    op.drop_table("applications")
    op.drop_table("sessions")
    op.drop_index("ix_users_email", table_name="users")
    op.drop_table("users")
