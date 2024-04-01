import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default defineEventHandler(async (event) => {
  const { email, message } = await readBody(event);

  assertMethod(event, ["POST"]);

  const html = `
    <h1>Bienvenido a Cotizador</h1>
    <div>
      <p>Puedes ver tu cotización en el siguiente enlace: </p>
      <a href="${message}">Ver cotización</a>
    </div>
    <img src="https://res.cloudinary.com/rafamed-dev/image/upload/v1711810440/cotizador-logo_vposmv.png" alt="Cotizador Logo" />
  `;

  try {
    const data = await resend.emails.send({
      from: "Cotizador <onboarding@resend.dev>",
      to: [email],
      subject: "Tienes una nueva cotización!",
      html,
    });

    return data;
  } catch (error) {
    return { error };
  }
});
