const
 { createClient } = 
(
'@supabase/supabase-js'
);
const
 supabaseUrl = 
'https://emkwllpfraiskjblphts.supabase.co'
;
const
 supabaseAnonKey = 
'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVta3dsbHBmcmFpc2tqYmxwaHRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNDg4ODEsImV4cCI6MjA2MzkyNDg4MX0.POZ5DMUgz-BIQy7f5WUnTTuu-3mevwLAzgQKTamfWBM'
;
const
 supabase = createClient(supabaseUrl, supabaseAnonKey);

// Verify connection immediately
console.log("Supabase initialized:", supabase);

// All other functions come AFTER initialization
async function loadArticles() {
    try {
        const { data, error } = await supabase
            .from('articles')
            .select('*');
            
        if (error) throw error;
        console.log("Articles loaded:", data);
        displayArticles(data);
    } catch (error) {
        console.error("Load error:", error);
        document.getElementById('articles-list').innerHTML = 
            `<p class="error">Error loading articles: ${error.message}</p>`;
    }
}

function displayArticles(articles) {
    const container = document.getElementById('articles-list');
    container.innerHTML = articles.map(article => `
        <div class="article">
            <h2>${article.title}</h2>
            <h3>${article.subtitle}</h3>
            <p class="meta">By ${article.author} • ${new Date(article.created_at).toLocaleDateString()}</p>
            <p>${article.content}</p>
        </div>
    `).join('');
}

// Set up event listeners AFTER DOM loads
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM loaded");
    loadArticles();
    
    document.getElementById('article-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const newArticle = {
            title: e.target.title.value,
            subtitle: e.target.subtitle.value,
            author: e.target.author.value,
            content: e.target.content.value,
            created_at: new Date().toISOString()
        };
        
        try {
            const { error } = await supabase
                .from('articles')
                .insert([newArticle]);
                
            if (error) throw error;
            e.target.reset();
            loadArticles();
        } catch (error) {
            console.error("Submit error:", error);
            alert(`Error submitting: ${error.message}`);
        }
    });
});
