import styles from "../page.module.css";

// http://localhost:3000/tft?hello=my%20friend

export default function Home({ params, searchParams }) {

  // console.log(params);        // {}
  // console.log(searchParams);  // { hello: 'my friend' }

  return (
    <main className={styles.main}>
      <h1>This is the tft page</h1>
      <h2>{searchParams.hello}</h2>
    </main>
  );
}
