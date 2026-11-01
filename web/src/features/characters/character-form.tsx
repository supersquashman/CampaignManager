import { useState } from 'preact/hooks';
import { ApiError } from '../../core/http';
import { Field } from '../../shared/components/field';
import { Modal } from '../../shared/components/modal';
import { PairEditor, pairsToObject, type Pair } from '../../shared/components/pair-editor';
import { charactersService } from './characters.service';
import { CHARACTER_TYPES, PARTY_ROLES, ROLE_ORDINALITY, STARTING_TOWNS, type Character, type CharacterType } from './characters.types';

interface CharacterFormProps {
  initialType: CharacterType;
  onSaved: (created: Character) => void;
  onClose: () => void;
}

export function CharacterForm({ initialType, onSaved, onClose }: CharacterFormProps) {
  const [values, setValues] = useState({ name: '', characterType: initialType as string, hometown: '', starting_town: '' });
  const [classPairs, setClassPairs] = useState<Pair[]>([{ label: '', value: '1' }]);
  const [missionPairs, setMissionPairs] = useState<Pair[]>([{ label: '', value: '' }]);
  const [rolePairs, setRolePairs] = useState<Pair[]>([{ label: '', value: '' }]);
  const [problems, setProblems] = useState<Record<string, string>>({});
  const [failure, setFailure] = useState('');
  const [saving, setSaving] = useState(false);

  const bind = (field: keyof typeof values) => ({
    value: values[field],
    onInput: (event: Event) => setValues({ ...values, [field]: (event.target as HTMLInputElement).value }),
  });

  async function submit(event: Event) {
    event.preventDefault();
    setSaving(true);
    setProblems({});
    setFailure('');
    try {
      const classLevels = Object.fromEntries(
        Object.entries(pairsToObject(classPairs)).map(([className, level]) => [className, Number(level)]),
      );
      const created = await charactersService.create({
        name: values.name,
        characterType: values.characterType as CharacterType,
        ClassLevels: classLevels,
        preferredMissions: pairsToObject(missionPairs, true),
        partyRoles: pairsToObject(rolePairs),
        hometown: values.hometown.trim() || undefined,
        starting_town: values.starting_town.trim() || undefined,
      });
      onSaved(created);
    } catch (caught) {
      if (caught instanceof ApiError && Object.keys(caught.fields).length) setProblems(caught.fields);
      else setFailure(caught instanceof Error ? caught.message : 'Could not save the character.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal onClose={onClose}>
      <h2 id="modal-title">Add character</h2>
      <form class="form-grid" onSubmit={submit}>
        <div class="form-two">
          <Field label="Name" required error={problems.name}>
            <input required {...bind('name')} />
          </Field>
          <Field label="Character type" required error={problems.characterType}>
            <select required {...bind('characterType')}>
              {CHARACTER_TYPES.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <PairEditor
          title="Class levels *"
          labelHeading="Class"
          valueHeading="Level"
          numeric
          requireFirst
          pairs={classPairs}
          onChange={setClassPairs}
          error={problems.classLevels}
        />
        <PairEditor
          title="Preferred missions (most preferred first)"
          labelHeading="Rank"
          valueHeading="Mission type"
          ranked
          pairs={missionPairs}
          onChange={setMissionPairs}
          error={problems.preferredMissions}
        />
        <PairEditor
          title="Party roles"
          // labelHeading="Rank (e.g. primary)"
          // valueHeading="Role"
          labelHeading='Role'
          valueHeading='Rank (e.g. primary)'
          rankLabels={PARTY_ROLES}
          valueOptions={ROLE_ORDINALITY}
          pairs={rolePairs}
          onChange={setRolePairs}
          error={problems.partyRoles}
        />

        <div class="form-two">
          <Field label="Hometown" required error={problems.hometown}>
            <select required {...bind('hometown')}>
              {STARTING_TOWNS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Starting Town" required error={problems.starting_town}>
            <select required {...bind('starting_town')}>
              {STARTING_TOWNS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </Field>
          
        </div>

        {failure && <p class="field-error">{failure}</p>}
        <div class="form-actions">
          <button type="button" class="secondary-button" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" class="primary-button" disabled={saving}>
            {saving ? 'Saving…' : 'Save character'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
