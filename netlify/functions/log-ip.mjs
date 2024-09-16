// export default async (req, context) => {
//   return new Response('Hello, world!');
// };

// export const handler = async (req, context) => {
//   return {
//     statusCode: 200,
//     body: JSON.stringify({ message: 'Hello World', name: req }),
//   };
// };

// netlify/functions/log-ip.js
export const handler = async (event, context) => {
  // Get the visitor's IP address from the request headers
  const visitorIp =
    event.headers['x-nf-client-connection-ip'] ||
    event.headers['client-ip'] ||
    event.headers['x-forwarded-for'] ||
    event.headers['remote-addr'];

  // Log the IP address (you can also save this to a database or external service if needed)
  console.log(`Visitor IP: ${visitorIp}`);

  // Respond back with a success message
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'IP address logged successfully',
      ip: visitorIp,
    }),
  };
};
