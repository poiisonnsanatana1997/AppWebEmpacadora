/**
 * Convierte una imagen de una ruta local a una cadena Base64.
 * @param {string} imageUrl - La ruta de la imagen a convertir.
 * @returns {Promise<string>} Una promesa que se resuelve con la cadena Base64 de la imagen.
 */
export const imageToBase64 = (imageUrl: string): Promise<string> => {
    return fetch(imageUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`No se pudo cargar la imagen: ${response.statusText}`);
        }
        return response.blob();
      })
      .then(blob => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            if (typeof reader.result === 'string') {
              resolve(reader.result);
            } else {
              reject(new Error('No se pudo convertir la imagen a Base64.'));
            }
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      });
  }; 