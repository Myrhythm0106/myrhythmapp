import { describe, expect, it } from 'vitest';
import { registrationSchema } from './registration';

describe('registration input', () => {
  it('keeps the full name and removes accidental email spaces', () => {
    expect(registrationSchema.parse({ name: ' Annabel Aaron ', email: ' Annabel@Example.com ', password: 'eight-long-words' })).toEqual({
      name: 'Annabel Aaron', email: 'annabel@example.com', password: 'eight-long-words',
    });
  });
  it('does not remove deliberate password spaces', () => {
    expect(registrationSchema.parse({ name: 'Annabel Aaron', email: 'annabel@example.com', password: ' password ' }).password).toBe(' password ');
  });
});