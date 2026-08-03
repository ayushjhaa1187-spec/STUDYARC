-- 20260803140000_mentor_matching_rpc.sql

CREATE OR REPLACE FUNCTION public.match_mentors(p_tags text[], p_budget numeric, p_limit int)
RETURNS TABLE (
    id UUID,
    full_name TEXT,
    rating NUMERIC,
    expertise_tags TEXT[],
    hourly_rate NUMERIC,
    total_sessions INT,
    has_availability BOOLEAN,
    match_score NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        m.id,
        m.full_name::text,
        m.rating::numeric,
        m.expertise_tags,
        m.hourly_rate::numeric,
        m.total_sessions::int,
        m.has_availability::boolean,
        (
            -- Expertise match score (40%)
            (CASE WHEN cardinality(p_tags) > 0 THEN 
                cardinality(ARRAY(SELECT unnest(m.expertise_tags) INTERSECT SELECT unnest(p_tags)))::numeric / cardinality(p_tags)::numeric
             ELSE 1.0 END * 0.40) +
            -- Availability score (20%)
            (CASE WHEN m.has_availability THEN 1.0 ELSE 0.0 END * 0.20) +
            -- Rating score (15%)
            ((m.rating / 5.0) * 0.15) +
            -- Budget fit score (10% if hourly_rate <= p_budget)
            (CASE WHEN m.hourly_rate <= p_budget THEN 1.0 ELSE 0.0 END * 0.10) +
            -- Cold start boost (5%)
            (m.cold_start_boost * 0.05)
        )::numeric(5,2) as match_score
    FROM public.active_mentors_mv m
    ORDER BY match_score DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
