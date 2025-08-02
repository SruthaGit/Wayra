// Test script for Nominatim proxy
const testProxy = async () => {
  const proxyUrl = 'https://nominatim-proxy-sruthagit.vercel.app/api/geocode';
  
  console.log('🧪 Testing Nominatim Proxy...');
  console.log('URL:', proxyUrl);
  
  try {
    const response = await fetch(`${proxyUrl}?query=Paris&limit=2`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const result = await response.json();
    console.log('✅ Proxy Response:');
    console.log(JSON.stringify(result, null, 2));
    
    if (result.data && result.data.length > 0) {
      console.log('🎉 Proxy is working! Found locations:', result.data.length);
    } else {
      console.log('⚠️ No locations found in response');
    }
    
  } catch (error) {
    console.error('❌ Proxy test failed:', error.message);
    console.log('💡 Make sure to deploy to Vercel first!');
  }
};

// Run the test
testProxy(); 