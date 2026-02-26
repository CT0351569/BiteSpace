import { createClient } from "@supabase/supabase-js";


const supabaseClient = createClient("https://adybybuoqeunggekybzl.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkeWJ5YnVvcWV1bmdnZWt5YnpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA4MjI1MTgsImV4cCI6MjA0NjM5ODUxOH0.NOrMKvq0iDBZF0QtVSe5Ql670jR61LktY2ET1Jjoqtc", {
});

export default supabaseClient;