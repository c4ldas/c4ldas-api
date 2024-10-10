export async function GET(request) {

  return Response.redirect(request.nextUrl.origin);
}

