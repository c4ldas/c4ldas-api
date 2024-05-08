import styles from "../page.module.css";

// http://localhost:3000/lol?hello=my%20friend

export default function Home({ params, searchParams }) {

  console.log(params);        // {}
  console.log(searchParams);  // { hello: 'my friend' }

  return (
    <main className={styles.main}>
      <h1>{searchParams.hello}</h1>
    </main>
  );
}
