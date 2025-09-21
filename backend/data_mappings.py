import json

# SUBSECTION CODES (all 501(c), 4947, 521, 527, etc.)
SUBSECTION = {
    "01": "501(c)(1) - Corporations Organized Under Act of Congress",
    "02": "501(c)(2) - Title Holding Corporations",
    "03": "501(c)(3) - Charitable, Educational, Religious, Scientific",
    "04": "501(c)(4) - Social Welfare Organizations",
    "05": "501(c)(5) - Labor, Agricultural, Horticultural Orgs",
    "06": "501(c)(6) - Business Leagues, Chambers of Commerce",
    "07": "501(c)(7) - Social and Recreational Clubs",
    "08": "501(c)(8) - Fraternal Beneficiary Societies",
    "09": "501(c)(9) - Voluntary Employees Beneficiary Associations",
    "10": "501(c)(10) - Domestic Fraternal Societies",
    "11": "501(c)(11) - Teachers’ Retirement Fund Associations",
    "12": "501(c)(12) - Benevolent Life Insurance Associations",
    "13": "501(c)(13) - Cemetery Companies",
    "14": "501(c)(14) - Credit Unions, Other Mutual Financial Orgs",
    "15": "501(c)(15) - Mutual Insurance Companies",
    "16": "501(c)(16) - Crop Financing Corporations",
    "17": "501(c)(17) - Supplemental Unemployment Benefit Trusts",
    "18": "501(c)(18) - Employee Funded Pension Trust",
    "19": "501(c)(19) - Veterans’ Organizations",
    "20": "501(c)(20) - Legal Service Plans",
    "21": "501(c)(21) - Black Lung Benefit Trusts",
    "22": "501(c)(22) - Withdrawal Liability Payment Fund",
    "23": "501(c)(23) - Veterans’ Associations (est. before 1880)",
    "24": "501(c)(24) - ERISA Trusts",
    "25": "501(c)(25) - Title Holding Corp. for Pensions",
    "26": "501(c)(26) - State-Sponsored Health Coverage Orgs",
    "27": "501(c)(27) - Workers’ Compensation Reinsurance Orgs",
    "28": "501(c)(28) - National Railroad Retirement Investment Trust",
    "29": "501(c)(29) - CO-OP Health Insurance Issuers",
    "40": "501(d) - Apostolic and Religious Orgs",
    "50": "501(e) - Cooperative Hospital Service Orgs",
    "60": "501(f) - Cooperative Service Orgs of Educational Institutions",
    "70": "501(k) - Child Care Organizations",
    "80": "501(n) - Charitable Risk Pools",
    "90": "4947(a)(1) - Nonexempt Charitable Trusts",
    "91": "4947(a)(2) - Split-Interest Trusts",
    "92": "527 - Political Organizations",
}

# AFFILIATION TYPE
AFFILIATION = {
    "1": "Central",
    "2": "Intermediate",
    "3": "Independent",
    "6": "Central organization",
    "9": "Subordinate",
}

# ORGANIZATION TYPE
ORGANIZATION = {
    "1": "Corporation",
    "2": "Trust",
    "3": "Association",
    "4": "Other",
}

# FOUNDATION TYPE
FOUNDATION = {
    "00": "All organizations except 501(c)(3)",
    "02": "Private Operating Foundation",
    "03": "Private Non-Operating Foundation",
    "09": "Suspense",
    "10": "Church",
    "11": "School",
    "12": "Hospital or Medical Research",
    "13": "Governmental Unit",
    "14": "Publicly Supported Organization (170(b)(1)(A)(vi))",
    "15": "Organization Supporting Multiple Orgs",
    "16": "Community Trust",
    "17": "Publicly Supported Org (170(b)(1)(A)(ii))",
    "18": "Publicly Supported Org (170(b)(1)(A)(iii))",
}

# DEDUCTIBILITY
DEDUCTIBILITY = {
    "1": "Contributions are deductible",
    "2": "Contributions not deductible",
    "4": "Deductible by treaty",
    "5": "Contributions deductible by special rule",
    "6": "Deductible for estate/gift, not income tax",
    "7": "Contributions limited",
}

# STATUS
STATUS = {
    "01": "Unconditional Exemption",
    "02": "Conditional Exemption",
    "12": "Terminated",
    "25": "Inactive",
    "40": "Revoked",
    "41": "Merger",
    "42": "Consolidation",
    "43": "Fully liquidated",
    "44": "Terminated",
    "46": "Inactive (other)",
}

# FILING REQUIREMENTS
FILING_REQ_CD = {
    "00": "None",
    "01": "Form 990",
    "02": "Form 990-EZ",
    "03": "Form 990-PF",
    "04": "Form 990-T",
    "06": "Form 990-BL",
}

# PRIVATE FOUNDATION FILING REQUIREMENTS
PF_FILING_REQ_CD = {
    "0": "No PF return",
    "1": "Form 990-PF required",
    "2": "Form 990-PF not required",
}

# ASSET CODES (ranges in $)
ASSET_CD = {
    "0": "0",
    "1": "1 - 9,999",
    "2": "10,000 - 24,999",
    "3": "25,000 - 99,999",
    "4": "100,000 - 499,999",
    "5": "500,000 - 999,999",
    "6": "1,000,000 - 4,999,999",
    "7": "5,000,000 - 9,999,999",
    "8": "10,000,000 - 49,999,999",
    "9": "50,000,000+",
}

# INCOME CODES (ranges in $)
INCOME_CD = {
    "0": "0",
    "1": "1 - 9,999",
    "2": "10,000 - 24,999",
    "3": "25,000 - 99,999",
    "4": "100,000 - 499,999",
    "5": "500,000 - 999,999",
    "6": "1,000,000 - 4,999,999",
    "7": "5,000,000 - 9,999,999",
    "8": "10,000,000 - 49,999,999",
    "9": "50,000,000+",
}


class NTEEManager:
    def __init__(self, filepath: str):
        """Load the NTEE codebook JSON file into memory."""
        with open(filepath, "r", encoding="utf-8") as f:
            self.codebook: dict[str, dict] = json.load(f)

    def get_entry(self, code: str) -> dict | None:
        """Return the full entry for a given code, or None if not found."""
        return self.codebook.get(code.upper())

    def get_title(self, code: str) -> str:
        """Return the title for a given code."""
        entry = self.get_entry(code)
        return entry.get("title") if entry else "Unknown code"

    def get_description(self, code: str) -> str:
        """Return the description for a given code."""
        entry = self.get_entry(code)
        return entry.get("description") if entry else "Unknown code"

    def get_keywords(self, code: str) -> list[str]:
        """Return the keywords list for a given code."""
        entry = self.get_entry(code)
        return entry.get("keywords", []) if entry else []

    def list_codes(self) -> list[str]:
        """Return a sorted list of all codes in the codebook."""
        return sorted(self.codebook.keys())


# Example usage:
if __name__ == "__main__":
    ntee = NTEEManager("data/ntee_codes.json")
    print(ntee.get_title("A"))  # "Arts, Culture & Humanities"
    print(ntee.get_description("A01"))  # Detailed description for A01
    print(
        ntee.get_keywords("A01")
    )  # ["Arts Alliances", "Arts Coalitions", "Lobbying", "Public Awareness"]
