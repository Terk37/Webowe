import { createClient } from '@supabase/supabase-js';
import { format } from 'date-fns'; 

const supabaseUrl = 'https://emkwllpfraiskjblphts.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVta3dsbHBmcmFpc2tqYmxwaHRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNDg4ODEsImV4cCI6MjA2MzkyNDg4MX0.POZ5DMUgz-BIQy7f5WUnTTuu-3mevwLAzgQKTamfWBM';
const supabase = createClient(supabaseUrl, supabaseKey);

async function displayArticles() {
  try {
    const container = document.getElementById('articles-list');
    if (!container) {
      console.error('Articles container not found');
      return;
    }

    const sortSelect = document.getElementById('sort');
    const sortValue = sortSelect ? sortSelect.value : 'created_at asc';
    const [column, direction] = sortValue.split(' ');

    const { data: articles, error } = await supabase
      .from('articles')
      .select('title, subtitle, author, created_at, content')
      .order(column, { ascending: direction === 'asc' });

    if (error) throw error;
    if (!articles || articles.length === 0) {
      container.innerHTML = '<p>No articles found</p>';
      return;
    }

     let html = '';
  articles.forEach((article) => {
    html += `
    <article class="pb-6 border-b border-gray-200">
      <h2 class="text-2xl font-semibold text-primary mb-2">${article.title || 'Brak tytułu'}</h2>
      
      <div class="text-sm text-secondary space-y-1 mb-4">
        ${article.subtitle ? `<p class="font-medium">${article.subtitle}</p>` : ''}
        <p><span class="font-medium">Autor:</span> ${article.author || 'Anonim'}</p>
        <p><span class="font-medium">Data:</span> ${format(new Date(article.created_at), 'dd-MM-yyyy')}</p>
      </div>
      
      <p class="text-secondary leading-relaxed">${article.content || ''}</p>
    </article>
    `;
  });

    container.innerHTML = html;
  } catch (error) {
    console.error('Error displaying articles:', error);
    const container = document.getElementById('articles-list');
    if (container) {
      container.innerHTML = '<p>Error loading articles</p>';
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  displayArticles();

  const form = document.getElementById('article-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      try {
        const title = form.querySelector('#title').value;
        const subtitle = form.querySelector('#subtitle').value;
        const author = form.querySelector('#author').value;
        const content = form.querySelector('#content').value;
        const createdAtRaw = form.querySelector('#created_at').value;

        
        const created_at = createdAtRaw 
          ? new Date(createdAtRaw).toISOString()
          : new Date().toISOString();

        const { error } = await supabase
          .from('articles')
          .insert([{ 
            title, 
            subtitle, 
            author, 
            content, 
            created_at 
          }]);

        if (error) throw error;

        form.reset();
        await displayArticles();
      } catch (error) {
        console.error('Error submitting form:', error);
        alert('Error submitting article');
      }
    });
  }

  const sortSelect = document.getElementById('sort');
  if (sortSelect) {
    sortSelect.addEventListener('change', displayArticles);
  }
});