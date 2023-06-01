import {TodoForm} from 'components/Todo';
import {GetServerSidePropsResult} from 'next';
import {useRouter} from 'next/router';
import {FormProvider, useForm} from 'react-hook-form';
import {ApiResoinse} from 'types/api/type';
import {Member, Status, TodoFormType, TodoListJsonData} from 'types/todo/type';

type Props = {
  todo: TodoListJsonData;
  memberList: Member[];
  statusList: Status[];
};

const EditTodo = ({todo, memberList, statusList}: Props) => {
  const router = useRouter();
  const useFormMethods = useForm<TodoFormType>({defaultValues: {...todo}});

  return (
      <FormProvider {...useFormMethods}>
        <TodoForm
            mode={'edit'}
            memberList={memberList}
            statusList={statusList}
            onComplete={() => router.push('/todo')}
            onBack={() => router.back()}
        />
      </FormProvider>
  );
};

export default EditTodo;

export const getServerSideProps = async (
    context: any,
): Promise<GetServerSidePropsResult<Props>> => {
  const response = await fetch(`http://localhost:3000/api/todo/${context.params.todoId}`, {
    method: 'GET',
  });

  const responseBody = (await response.json()) as ApiResoinse<TodoListJsonData>;

  const memberList = await getMemberList();
  const statusList = await getStatusList();

  return {
    props: {todo: responseBody.data, memberList, statusList},
  };
};

const getMemberList = async (): Promise<Member[]> => {
  const response = await fetch(`http://localhost:3000/api/member`, {
    method: 'GET',
  });

  const responseBody = await response.json() as ApiResoinse<Member[]>;

  return responseBody.data;
};

const getStatusList = async (): Promise<Status[]> => {
  const response = await fetch(`http://localhost:3000/api/status`, {
    method: 'GET',
  });

  const responseBody = await response.json() as ApiResoinse<Status[]>;

  return responseBody.data;
};
