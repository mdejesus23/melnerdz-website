// netlify/functions/log-ip.js
export default async (event, context) => {
  // Respond back with a success message
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'IP address logged successfully',
    }),
  };
};
