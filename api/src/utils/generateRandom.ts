import { nanoid } from 'nanoid';

/**
 * Genera un identificador aleatorio de 5 caracteres para usar como shortURL.
 * Utiliza nanoid para asegurar unicidad y aleatoriedad.
 * @returns {string} Identificador único de 5 caracteres.
 */

/**
 * Generates a random string of specified length using alphanumeric characters.
 * @param length - Length of the string to generate
 * @returns Random alphanumeric string
 */
const generateRandom = () => nanoid(5);

export default generateRandom;
