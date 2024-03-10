import input from './input.json'; // This import style requires "esModuleInterop", see "side notes"
import { convertEntities } from './todo';
import { Entity } from './types/input';

console.log(convertEntities(input.documents[0].entities as Entity[]));
