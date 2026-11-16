import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Helper to load .env.local or .env if present
function loadEnv() {
  const envFiles = ['.env.local', '.env'];
  for (const envFile of envFiles) {
    const fullPath = path.join(rootDir, envFile);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const [key, ...rest] = trimmed.split('=');
        if (key && rest.length > 0) {
          const val = rest.join('=').replace(/^["']|["']$/g, '').trim();
          if (!process.env[key.trim()]) {
            process.env[key.trim()] = val;
          }
        }
      }
    }
  }
}

loadEnv();

const API_KEY = process.env.GOOGLE_PLACES_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

if (!API_KEY) {
  console.error('\n❌ ERRO: Nenhuma chave da Google Places API encontrada!');
  console.error('👉 Adicione GOOGLE_PLACES_API_KEY=sua_chave no arquivo .env.local\n');
  process.exit(1);
}

const SEARCH_QUERY = 'LUME controle solar Realengo Rio de Janeiro';
const DATA_FILE = path.join(rootDir, 'src', 'data', 'googleReviews.json');

const AVATAR_COLORS = ['bg-[#1a3a5c]', 'bg-[#c9a227]', 'bg-slate-700', 'bg-blue-900', 'bg-amber-800'];

async function syncGoogleReviews() {
  console.log(`\n🔍 Buscando dados no Google Places API (New)...`);
  console.log(`📍 Query: "${SEARCH_QUERY}"\n`);

  try {
    const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': API_KEY,
        'X-Goog-FieldMask': 'places.id,places.displayName,places.rating,places.userRatingCount,places.googleMapsUri,places.reviews',
      },
      body: JSON.stringify({
        textQuery: SEARCH_QUERY,
        languageCode: 'pt-BR',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Google API HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const place = data.places?.[0];

    if (!place) {
      throw new Error(`Nenhum local encontrado para a busca "${SEARCH_QUERY}".`);
    }

    console.log(`✅ Local encontrado: ${place.displayName?.text || 'LUME'}`);
    console.log(`⭐ Nota Média: ${place.rating}`);
    console.log(`📊 Total de Avaliações: ${place.userRatingCount}`);

    // Load existing file for fallback
    let currentData = {};
    if (fs.existsSync(DATA_FILE)) {
      try {
        currentData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
      } catch (e) {
        currentData = {};
      }
    }

    // Process reviews if returned
    let formattedReviews = currentData.reviews || [];
    if (place.reviews && Array.isArray(place.reviews) && place.reviews.length > 0) {
      formattedReviews = place.reviews
        .filter((rev) => (rev.text?.text || rev.originalText?.text || '').trim().length > 0)
        .map((rev, index) => {
          const authorName = rev.authorAttribution?.displayName || 'Cliente';
          const reviewText = (rev.text?.text || rev.originalText?.text || '').trim();
          const initial = authorName.charAt(0).toUpperCase() || 'C';
          const color = AVATAR_COLORS[index % AVATAR_COLORS.length];

          return {
            id: index + 1,
            name: authorName,
            date: rev.relativePublishTimeDescription || 'Recentemente',
            rating: rev.rating || 5,
            text: reviewText,
            initial,
            color,
            authorUri: rev.authorAttribution?.uri || null,
            photoUri: rev.authorAttribution?.photoUri || null,
          };
        });
    }

    const payload = {
      rating: place.rating ?? currentData.rating ?? 5.0,
      userRatingCount: place.userRatingCount ?? currentData.userRatingCount ?? 31,
      googleMapsUrl: place.googleMapsUri || currentData.googleMapsUrl || 'https://maps.app.goo.gl/HQ6qCNNRxRGT6rgZ7',
      lastSyncedAt: new Date().toISOString(),
      reviews: formattedReviews.length > 0 ? formattedReviews : currentData.reviews,
    };

    fs.writeFileSync(DATA_FILE, JSON.stringify(payload, null, 2), 'utf8');

    console.log(`\n🎉 Sincronização concluída com sucesso!`);
    console.log(`📁 Arquivo atualizado: src/data/googleReviews.json`);
    console.log(`⭐ Nota: ${payload.rating}`);
    console.log(`📝 Total: ${payload.userRatingCount} avaliações`);
    console.log(`💬 Depoimentos salvos: ${payload.reviews.length}\n`);
  } catch (error) {
    console.error(`\n❌ Falha ao sincronizar avaliações:`, error.message);
    process.exit(1);
  }
}

syncGoogleReviews();
