// Test script for search functionality
const testSearch = async () => {
  console.log('🧪 Testing Search Functionality...\n');
  
  const testQueries = ['Paris', 'Tokyo', 'Eiffel Tower', 'New York'];
  
  for (const query of testQueries) {
    console.log(`🔍 Testing: "${query}"`);
    
    try {
      // Test proxy first
      console.log('  🔗 Trying proxy...');
      const proxyResponse = await fetch(
        `https://nominatim-proxy-sruthagit.vercel.app/api/geocode?query=${encodeURIComponent(query)}&limit=2`
      );
      
      if (proxyResponse.ok) {
        const proxyData = await proxyResponse.json();
        console.log(`  ✅ Proxy: Found ${proxyData.data?.length || 0} results`);
      } else {
        console.log(`  ❌ Proxy failed: ${proxyResponse.status}`);
      }
      
      // Test direct Nominatim
      console.log('  🌐 Trying direct Nominatim...');
      const directResponse = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=2`
      );
      
      if (directResponse.ok) {
        const directData = await directResponse.json();
        console.log(`  ✅ Direct: Found ${directData.length || 0} results`);
      } else {
        console.log(`  ❌ Direct failed: ${directResponse.status}`);
      }
      
    } catch (error) {
      console.log(`  ❌ Error: ${error.message}`);
    }
    
    console.log('');
  }
  
  console.log('🎯 Test completed!');
};

// Run the test
testSearch(); 