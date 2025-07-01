def calculate_sis(dmatrix_json, qa_priorities):
    sis_scores = {}

    for option, directions in dmatrix_json["dmatrices"].items():
        total_score = 0
        for direction, matrix in directions.items():
            for src_qa, targets in matrix.items():
                for tgt_qa, impact in targets.items():
                    if impact == "-" or tgt_qa not in qa_priorities:
                        continue
                    impact_val = int(impact)
                    weight = qa_priorities[tgt_qa]
                    total_score += impact_val * weight

        sis_scores[option] = total_score

    return sis_scores
