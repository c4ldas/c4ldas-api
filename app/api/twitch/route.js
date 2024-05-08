export async function GET(request) {
  console.log(request.nextUrl.pathname);

  return Response.json(request.nextUrl.pathname);

}