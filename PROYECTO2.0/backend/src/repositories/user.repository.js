import Usuario from '../models/user.js';
import RepositoryBase from './RepositoryBase.js';

const usuarioRepository = new RepositoryBase(Usuario);

export default usuarioRepository;