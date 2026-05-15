import React from 'react';
import { LegalLayout } from './LegalLayout';

export const PrivacyPage: React.FC = () => {
  return (
    <LegalLayout
      title="Politica de Privacidad"
      subtitle="Tu privacidad es nuestra prioridad. Conoce como protegemos tus datos."
      lastUpdated="13 de mayo de 2026"
      seoDescription="Política de privacidad de Dentiqly. Conocé cómo protegemos tus datos personales y los de tus pacientes con encriptación AES-256 y protocolos de seguridad empresarial."
      seoCanonical="/privacidad"
    >
      <h2>1. Informacion que recopilamos</h2>
      <p>
        En Dentiqly, recopilamos informacion que nos proporcionas directamente al registrarte y utilizar nuestro servicio.
        Esto incluye:
      </p>
      <ul>
        <li><strong>Datos de la clinica:</strong> nombre de la clinica, direccion, telefono, sitio web.</li>
        <li><strong>Datos del administrador:</strong> nombre completo, correo electronico, contrasena (almacenada de forma encriptada).</li>
        <li><strong>Datos de pacientes:</strong> nombre, apellido, documento de identidad, fecha de nacimiento, contacto, historial clinico, odontograma, archivos medicos.</li>
        <li><strong>Datos de facturacion:</strong> informacion de pagos, historial de transacciones.</li>
        <li><strong>Datos de uso:</strong> interacciones con la plataforma, registros de acceso, preferencias.</li>
      </ul>

      <h2>2. Como utilizamos tu informacion</h2>
      <p>Utilizamos la informacion recopilada para:</p>
      <ul>
        <li>Proporcionar, mantener y mejorar nuestros servicios de gestion dental.</li>
        <li>Procesar turnos, historias clinicas y facturacion.</li>
        <li>Enviar notificaciones y recordatorios (email, SMS, WhatsApp) sobre turnos y servicios.</li>
        <li>Personalizar tu experiencia en la plataforma.</li>
        <li>Cumplir con obligaciones legales y regulatorias.</li>
        <li>Prevenir fraude y garantizar la seguridad de la plataforma.</li>
      </ul>

      <h2>3. Almacenamiento y seguridad</h2>
      <p>
        Protegemos tu informacion con las mas altas medidas de seguridad de la industria:
      </p>
      <ul>
        <li><strong>Encriptacion AES-256</strong> para todos los datos almacenados.</li>
        <li><strong>Conexiones SSL/TLS</strong> para toda la comunicacion entre tu navegador y nuestros servidores.</li>
        <li><strong>Copias de seguridad automaticas</strong> cada hora en servidores redundantes.</li>
        <li><strong>Acceso controlado</strong> mediante autenticacion multi-factor para nuestro equipo tecnico.</li>
        <li>Servidores alojados en centros de datos certificados con cumplimiento ISO 27001.</li>
      </ul>

      <h2>4. Comparticion de datos</h2>
      <p>
        No vendemos, alquilamos ni compartimos tu informacion personal con terceros para fines de marketing.
        Solo compartimos datos en los siguientes casos:
      </p>
      <ul>
        <li><strong>Con tu consentimiento:</strong> cuando nos autorizas explicitamente.</li>
        <li><strong>Proveedores de servicio:</strong> empresas que nos ayudan a operar la plataforma (hosting, email, pasarela de pagos), bajo estrictos acuerdos de confidencialidad.</li>
        <li><strong>Requerimiento legal:</strong> cuando la ley nos obliga a divulgar informacion.</li>
      </ul>

      <h2>5. Aislamiento multi-tenant</h2>
      <p>
        Dentiqly opera bajo un modelo multi-tenant donde cada clinica tiene su propio espacio aislado.
        Los datos de una clinica nunca son accesibles por otra. Cada tenant tiene su propia base de datos
        logica, garantizando la separacion total de la informacion.
      </p>

      <h2>6. Tus derechos</h2>
      <p>Como usuario de Dentiqly, tienes derecho a:</p>
      <ul>
        <li><strong>Acceder</strong> a toda la informacion que tenemos sobre ti.</li>
        <li><strong>Rectificar</strong> datos incorrectos o desactualizados.</li>
        <li><strong>Eliminar</strong> tus datos personales (derecho al olvido).</li>
        <li><strong>Exportar</strong> tus datos en formato legible por maquina.</li>
        <li><strong>Revocar</strong> tu consentimiento en cualquier momento.</li>
      </ul>
      <p>
        Para ejercer cualquiera de estos derechos, contactanos en{' '}
        <a href="mailto:privacidad@dentiqly.com">privacidad@dentiqly.com</a>.
      </p>

      <h2>7. Retencion de datos</h2>
      <p>
        Conservamos tus datos mientras mantengas una cuenta activa en Dentiqly. Si cancelas tu suscripcion,
        tus datos seran retenidos por 90 dias adicionales para facilitar la reactivacion. Transcurrido ese
        periodo, los datos seran eliminados de forma permanente, salvo obligacion legal de retenerlos.
      </p>

      <h2>8. Cambios a esta politica</h2>
      <p>
        Podemos actualizar esta politica periodicamente. Te notificaremos por correo electronico sobre
        cualquier cambio significativo. El uso continuado de la plataforma despues de la notificacion
        constituye la aceptacion de la politica actualizada.
      </p>

      <h2>9. Contacto</h2>
      <p>
        Si tienes preguntas sobre esta Politica de Privacidad, contactanos en:{' '}
        <a href="mailto:privacidad@dentiqly.com">privacidad@dentiqly.com</a>
      </p>
    </LegalLayout>
  );
};
