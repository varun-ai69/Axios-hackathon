const { initVectorDB } = require('./services/vectorDB');
const { QdrantClient } = require('@qdrant/js-client-rest');

async function checkVectorDB() {
  try {
    console.log('🔍 Checking Vector DB...');
    
    const client = new QdrantClient({ url: 'http://localhost:6333' });
    
    // Check collections
    const collections = await client.getCollections();
    console.log('📚 Collections:', collections.collections.map(c => c.name));
    
    // Check documents collection
    const documentsCollection = collections.collections.find(c => c.name === 'documents');
    if (documentsCollection) {
      const info = await client.getCollection('documents');
      console.log('📊 Documents Collection Info:', {
        vectors_count: info.result.vectors_count,
        points_count: info.result.points_count,
        status: info.result.status
      });
      
      // Sample some points
      if (info.result.points_count > 0) {
        const sample = await client.scroll('documents', { limit: 3 });
        console.log('📝 Sample points:', sample.result.points.map(p => ({
          id: p.id,
          source: p.payload.source,
          text_preview: p.payload.text?.substring(0, 100) + '...'
        })));
      }
    } else {
      console.log('❌ No documents collection found');
    }
    
  } catch (error) {
    console.error('❌ Vector DB error:', error);
  }
}

checkVectorDB();
