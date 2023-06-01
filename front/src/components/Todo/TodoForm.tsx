import clsx from 'clsx';
import styles from './todo.module.scss';
import {Member, Status, TodoFormType} from 'types/todo/type.d';
import {useFormContext} from 'react-hook-form';
import {Layout} from 'components/Layout';

type Mode = 'new' | 'edit';

type Props = {
  mode: Mode;
  memberList: Member[];
  statusList: Status[];
  onComplete?: VoidFunction;
  onBack?: VoidFunction;
};

export const TodoForm = ({
                           mode,
                           onComplete,
                           onBack,
                           statusList,
                           memberList,
                         }: Props) => {
  const {register, getValues} = useFormContext<TodoFormType>();

  const onSubmit = async (data: TodoFormType) => {
    await fetch(`http://localhost:3000/api/todo/${getValues("id")}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });

    onComplete?.();
  };

  const handleDelete = async () => {
    await fetch(`http://localhost:3000/api/todo/${getValues("id")}`, {
      method: 'DELETE',
    });

    onComplete?.();
  };

  return (
      <Layout
          pageTitle={`TODO${mode === 'new' ? '新規作成' : '編集'}`}
          rightItems={
            <>
              <button
                  type="button"
                  className={clsx('btn btn-primary', styles.btn)}
                  onClick={() => onSubmit(getValues())}
              >
                保存
              </button>

              {mode === 'edit' && (
                  <button
                      className={clsx('btn btn-danger', styles.btn)}
                      onClick={handleDelete}
                  >
                    削除
                  </button>
              )}

              <button
                  type="button"
                  className={clsx('btn btn-secondary', styles.btn)}
                  onClick={onBack}
              >
                閉じる
              </button>
            </>
          }
      >
        <form className={clsx('form')}>
          <div className={clsx(styles.formGroup)}>
            <div className={clsx(styles.formItem)}>
              <label className={clsx('form-label', styles.labelName)}>
                タイトル
              </label>
              <input type="text" {...register('title')}></input>
            </div>

            <div className={clsx(styles.formItem)}>
              <label className={clsx('form-label', styles.labelName)}>
                ステータス
              </label>
              <select
                  className="form-select"
                  {...register('status')}
                  defaultValue="0"
              >
                {statusList.map((status) => (
                    <option key={status.id} value={status.id}>
                      {status.label}
                    </option>
                ))}
              </select>
            </div>

            <div className={clsx(styles.formItem)}>
              <label className={clsx('form-label', styles.labelName)}>
                担当者
              </label>
              <select
                  className="form-select"
                  {...register('assignment')}
                  defaultValue="0"
              >
                {memberList.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name}
                    </option>
                ))}
              </select>
            </div>

            <div className={clsx(styles.formItem)}>
              <label className={clsx('form-label', styles.labelName)}>
                内容
              </label>
              <textarea
                  className="form-control"
                  rows={10}
                  {...register('detail')}
              />
            </div>
          </div>
        </form>
      </Layout>
  );
};
