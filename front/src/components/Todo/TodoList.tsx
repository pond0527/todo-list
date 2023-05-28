// import clsx from 'clsx';
// import { Layout } from 'components/Layout';
// import styles from './todo.module.scss';
// import { useState } from 'react';
// import {NewTodo} from "./NewTodo";

// export const TodoList = () => {
//     const [isNewArea, setIsNewArea] = useState(false);

//     return (
//         <Layout
//             pageTitle="TODOリスト"
//             rightItems={
//                 <>
//                     <button
//                         className={clsx('btn btn-primary', styles.btn)}
//                         onClick={() => setIsNewArea(true)}
//                     >
//                         新規作成
//                     </button>
//                 </>
//             }
//         >
//             {/* {isNewArea && <NewTodo />} */}

//             <label className={clsx('form-label', styles.labelName)}>一覧</label>
//             <table className="table">
//                 <thead>
//                     <tr>
//                         <th>名前</th>
//                         <th>ステータス</th>
//                         <th>担当者</th>
//                         <th>起票日</th>
//                         <th>更新日</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     <tr>
//                         <td>名前</td>
//                         <td>ステータス</td>
//                         <td>担当者</td>
//                         <td>起票日</td>
//                         <td>更新日</td>
//                     </tr>
//                 </tbody>
//             </table>
//         </Layout>
//     );
// };

