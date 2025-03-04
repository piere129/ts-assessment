import { expect } from 'chai';
import inputJson from './input.json';
import outputJson from './output.json';
import { convertInput } from './todo';
import { Input } from './types/input';

describe('Todo', () => {
  it('Should be able to convert the input (flat lists) to the output (nested) structure', () => {
    const output = convertInput(inputJson as Input);

    expect(output.documents.length).to.equal(1);
    expect(output.documents[0].entities.length).to.equal(14);
    expect(output.documents[0].annotations.length).to.equal(9);
    expect(output).to.deep.equal(outputJson);
  });
});
