#!/usr/bin/env python3
import csv
import sys
import os

def validate_submission(csv_path):
    print("=========================================")
    print("   BHARAT AI CHALLENGE SUBMISSION VALIDATOR")
    print("=========================================\n")
    
    if not os.path.exists(csv_path):
        print(f"❌ ERROR: Submission file not found at: {csv_path}")
        return False

    required_headers = ["candidate_id", "rank", "score", "reasoning"]
    
    try:
        with open(csv_path, 'r', encoding='utf-8') as f:
            reader = csv.reader(f)
            headers = next(reader, None)
            
            if not headers:
                print("❌ ERROR: CSV file is empty!")
                return False
                
            # Normalize headers (strip whitespace and lower case)
            headers_normalized = [h.strip().lower() for h in headers]
            
            # Check headers
            for req in required_headers:
                if req not in headers_normalized:
                    print(f"❌ ERROR: Missing required header: '{req}'")
                    print(f"Found headers: {headers}")
                    return False
            
            # Map header indices
            id_idx = headers_normalized.index("candidate_id")
            rank_idx = headers_normalized.index("rank")
            score_idx = headers_normalized.index("score")
            reason_idx = headers_normalized.index("reasoning")
            
            rows = list(reader)
            print(f"ℹ️ Found {len(rows)} candidate rows in CSV.")
            
            if len(rows) != 100:
                print(f"❌ ERROR: Expected exactly 100 candidates, but found {len(rows)} rows.")
                return False
                
            last_score = float('inf')
            
            for i, row in enumerate(rows, start=1):
                if len(row) < len(required_headers):
                    print(f"❌ ERROR [Row {i+1}]: Row does not contain enough columns. Content: {row}")
                    return False
                
                cand_id = row[id_idx].strip()
                rank_str = row[rank_idx].strip()
                score_str = row[score_idx].strip()
                reasoning = row[reason_idx].strip()
                
                # 1. Validate Candidate ID
                if not cand_id:
                    print(f"❌ ERROR [Row {i+1}]: candidate_id is empty.")
                    return False
                
                # 2. Validate Rank sequence
                try:
                    rank_val = int(rank_str)
                    if rank_val != i:
                        print(f"❌ ERROR [Row {i+1}]: Rank mismatch. Expected sequential rank '{i}', found '{rank_val}'.")
                        return False
                except ValueError:
                    print(f"❌ ERROR [Row {i+1}]: Invalid rank value '{rank_str}'. Must be an integer.")
                    return False
                
                # 3. Validate Score value & ordering
                try:
                    score_val = float(score_str)
                    if score_val > last_score:
                        print(f"❌ ERROR [Row {i+1}]: Score ordering violation! Score {score_val} is greater than previous score {last_score}.")
                        print(f"Scores must be sorted in descending order (score1 >= score2 >= ...).")
                        return False
                    last_score = score_val
                except ValueError:
                    print(f"❌ ERROR [Row {i+1}]: Invalid score value '{score_str}'. Must be a number.")
                    return False
                
                # 4. Validate non-empty reasoning
                if not reasoning:
                    print(f"❌ ERROR [Row {i+1}]: Reasoning field is empty for candidate '{cand_id}'. Each candidate must have a reasoning.")
                    return False
                
                if len(reasoning) < 10:
                    print(f"⚠️ WARNING [Row {i+1}]: Reasoning text is very short ({len(reasoning)} chars). Recommended length >= 10 chars.")

            print("✅ SUCCESS: All submission requirements are perfectly met!")
            print("  - Headers: OK")
            print("  - Candidate Count: OK (exactly 100)")
            print("  - Ranks Sequential: OK")
            print("  - Score Ordering descending: OK")
            print("  - Reasoning Integrity: OK\n")
            return True
            
    except Exception as e:
        print(f"❌ ERROR: Failed to read or parse CSV: {e}")
        return False

if __name__ == "__main__":
    path = "submission.csv"
    if len(sys.argv) > 1:
        path = sys.argv[1]
    
    success = validate_submission(path)
    sys.exit(0 if success else 1)
