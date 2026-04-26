from typing import Any

# Regulation B reason code mapping
_SHAP_TO_REASON: dict[str, dict[str, str]] = {
    "payment_history_pct": {
        "code": "Code 1",
        "text": "Delinquent past or present credit obligations with others",
    },
    "credit_utilization_ratio": {
        "code": "Code 2",
        "text": "Too high a proportion of debt in relation to credit limits",
    },
    "amounts_owed": {
        "code": "Code 3",
        "text": "Amount owed on accounts is too high",
    },
    "credit_length_months": {
        "code": "Code 8",
        "text": "Length of time accounts have been established is too short",
    },
    "new_inquiries_6m": {
        "code": "Code 7",
        "text": "Too many inquiries in the last 12 months",
    },
    "annual_income": {
        "code": "Code 14",
        "text": "Income insufficient for amount of credit requested",
    },
    "mobile_usage_score": {
        "code": "Code A1",
        "text": "Alternative data signals indicate elevated repayment risk",
    },
    "utility_payment_ratio": {
        "code": "Code A2",
        "text": "Utility payment history indicates financial stress",
    },
}

_CREDIT_RIGHTS = (
    "You have the right to obtain a free copy of your credit report from any "
    "consumer reporting agency within 60 days of receiving this notice. "
    "You also have the right to dispute inaccurate information in your report "
    "by contacting the consumer reporting agency directly."
)

_APPLICANT_RIGHTS = (
    "Under the Equal Credit Opportunity Act, it is illegal to discriminate "
    "against credit applicants on the basis of race, color, religion, national "
    "origin, sex, marital status, age, or because you receive public assistance. "
    "If you believe you have been discriminated against, contact the Consumer "
    "Financial Protection Bureau (CFPB) at consumerfinance.gov."
)


def generate_adverse_action(
    probability_of_default: float,
    score: int,
    shap_items: list[dict[str, Any]],
) -> dict[str, Any]:
    """
    Generate ECOA Regulation B adverse action notice.
    Triggered when probability_of_default > 0.5 or score < 620.
    """
    required = probability_of_default > 0.5 or score < 620
    if not required:
        return {
            "required": False,
            "reasons": [],
            "notice_text": "",
            "credit_report_rights": _CREDIT_RIGHTS,
            "applicant_rights": _APPLICANT_RIGHTS,
        }

    # Select top negative SHAP contributors (those that increased default probability)
    negative_items = [
        item for item in shap_items if item.get("shap_value", 0.0) < 0
    ]
    negative_items.sort(key=lambda d: d["shap_value"])
    top_factors = negative_items[:4]

    reasons = []
    for item in top_factors:
        feat = item["feature_name"]
        mapping = _SHAP_TO_REASON.get(
            feat,
            {"code": "Code 99", "text": f"Unfavorable credit factor: {feat}"},
        )
        reasons.append(
            {
                "code": mapping["code"],
                "plain_text": mapping["text"],
                "shap_value": float(item["shap_value"]),
            }
        )

    reason_list = "; ".join(r["plain_text"] for r in reasons) if reasons else "Credit profile does not meet minimum requirements"
    notice_text = (
        f"We regret that your credit application has been declined. "
        f"The primary reasons for this decision are: {reason_list}. "
        f"This decision was made in compliance with the Equal Credit Opportunity Act "
        f"and the Fair Credit Reporting Act."
    )

    return {
        "required": True,
        "reasons": reasons,
        "notice_text": notice_text,
        "credit_report_rights": _CREDIT_RIGHTS,
        "applicant_rights": _APPLICANT_RIGHTS,
    }
