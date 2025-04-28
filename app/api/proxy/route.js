export async function GET() {
    try {
      const response = await fetch('https://mmc-clinic.com/dipa/api/mhs.php');
      const data = await response.json();
      return Response.json(data);
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Failed to fetch data' }), { status: 500 });
    }
  }
  