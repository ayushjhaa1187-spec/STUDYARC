
-- Update timestamp trigger function
CREATE OR REPLACE FUNCTION update_modified_column() 
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW; 
END;
$$ language 'plpgsql';

-- Give users XP when tasks are completed
CREATE OR REPLACE FUNCTION reward_task_xp()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_completed = true AND OLD.is_completed = false THEN
        UPDATE public.users SET reputation_score = reputation_score + 10 WHERE id = (
            SELECT user_id FROM public.sprints WHERE id = NEW.sprint_id
        );
        INSERT INTO public.user_activities (user_id, event_type, metadata)
        VALUES (
            (SELECT user_id FROM public.sprints WHERE id = NEW.sprint_id),
            'task_completed',
            jsonb_build_object('task_id', NEW.id, 'xp_gained', 10)
        );
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER task_completion_xp
    AFTER UPDATE ON public.tasks
    FOR EACH ROW
    EXECUTE FUNCTION reward_task_xp();
