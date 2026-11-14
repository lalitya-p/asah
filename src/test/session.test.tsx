import { act, cleanup, render } from '@testing-library/react';
import { afterEach, expect, it } from 'vitest';
import { LanguageProvider } from '@/components/asah/language';
import { AsahProvider, useAsah } from '@/components/asah/store';

afterEach(() => {
  cleanup();
  localStorage.clear();
});

let store: ReturnType<typeof useAsah> | undefined;
function Probe() {
  store = useAsah();
  return null;
}
function mount() {
  render(
    <LanguageProvider>
      <AsahProvider>
        <Probe />
      </AsahProvider>
    </LanguageProvider>,
  );
}
const nara = { id: 'child-nara', name: 'Nara', dob: '2023-04-01' };

it('keeps family records after signing out and restores them on sign in', () => {
  mount();
  act(() => store?.createSpace('Uji'));
  act(() => store?.finish(nara, [], true));
  act(() =>
    store?.update(s => ({
      ...s,
      role: 'Ibu',
      logs: [
        {
          id: 'l1',
          childId: nara.id,
          activityId: 'cilukba',
          title: 'Ciluk ba',
          focus: 'Dengan others',
          stage: 2,
          duration: 5,
          at: '2026-11-14T02:00:00.000Z',
          response: 'Ya',
        },
      ],
    })),
  );
  const saved = JSON.stringify(store?.state);
  act(() => store?.signOut());
  expect(store?.account).toBeNull();
  expect(store?.destination).toBe('welcome');
  expect(store?.state.children).toEqual([]);
  expect(store?.state.logs).toEqual([]);
  const id = store?.accounts[0]?.id ?? '';
  act(() => store?.signIn(id));
  expect(JSON.stringify(store?.state)).toBe(saved);
  expect(store?.destination).toBe('app');
});

it('keeps onboarding progress across a sign out and sign in', () => {
  mount();
  act(() => store?.createSpace('Uji'));
  act(() => store?.patchOnboarding({ step: 4, draftChild: nara, draftItems: [{ id: 'rice', quantity: 1 }] }));
  act(() => store?.saveRole('Ayah'));
  act(() => store?.signOut());
  expect(store?.destination).toBe('welcome');
  const id = store?.accounts[0]?.id ?? '';
  act(() => store?.signIn(id));
  expect(store?.onboarding.step).toBe(4);
  expect(store?.onboarding.draftChild).toEqual(nara);
  expect(store?.onboarding.draftItems).toEqual([{ id: 'rice', quantity: 1 }]);
  expect(store?.state.role).toBe('Ayah');
  expect(store?.destination).toBe('onboarding');
});

it('sends a space that lost every child to child setup instead of onboarding', () => {
  mount();
  act(() => store?.createSpace('Uji'));
  act(() => store?.finish(nara, [], true));
  expect(store?.destination).toBe('app');
  act(() => store?.update(s => ({ ...s, children: [], selected: '' })));
  expect(store?.destination).toBe('setup-child');
  expect(store?.onboarding.status).toBe('complete');
});

it('adds another child without restarting onboarding or re-asking the role', () => {
  mount();
  act(() => store?.createSpace('Uji'));
  act(() => store?.saveRole('Kakek / Nenek'));
  act(() => store?.finish(nara, [{ id: 'rice', quantity: 1 }], false));
  act(() =>
    store?.addExistingChild({
      id: 'child-kini',
      name: 'Kini',
      dob: '2025-01-01',
    }),
  );
  expect(store?.state.children.map(child => child.name)).toEqual(['Nara', 'Kini']);
  expect(store?.state.role).toBe('Kakek / Nenek');
  expect(store?.onboarding.status).toBe('complete');
  expect(store?.destination).toBe('app');
});

it('erases a space completely when all data is deleted', () => {
  mount();
  act(() => store?.createSpace('Uji'));
  act(() => store?.finish(nara, [], true));
  act(() => store?.deleteSpace());
  expect(store?.accounts).toEqual([]);
  expect(store?.account).toBeNull();
  expect(store?.destination).toBe('welcome');
  expect(localStorage.getItem('asah-accounts-v1')).toContain('"accounts":[]');
});
