from vigil import VigilScanner

def validate_input(query: str) -> bool:
    # Length check
    if len(query) > 200: return False
    
    # Keyword denylist
    prohibited_terms = ["crypto", "nft", "personal", "hypothetical"]
    if any(term in query.lower() for term in prohibited_terms):
        return False
        
    # Stock-specific allowlist
    stock_keywords = ["stock", "share", "NYSE", "NASDAQ", "dividend"]
    if not any(kw in query.lower() for kw in stock_keywords):
        return False
    
    # ML-based injection detection
    scanner = VigilScanner()
    return scanner.is_clean(query)
