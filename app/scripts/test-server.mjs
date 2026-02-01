/**
 * Servidor mínimo para testar se localhost funciona.
 * Executa: node scripts/test-server.mjs
 * Abre: http://127.0.0.1:8888
 */
import { createServer } from 'http';
const server = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end('<h1>Funciona!</h1><p>Se ves isto, o Node consegue servir na tua máquina.</p>');
});
server.listen(8888, '127.0.0.1', () => {
  console.log('Servidor de teste: http://127.0.0.1:8888');
  console.log('Abre no browser. Pressiona Ctrl+C para parar.');
});
