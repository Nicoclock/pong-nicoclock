import {memo} from 'react';

import styles from './Page404.module.css';

const Page404 = () => {
    return (
        <main className={`main ${styles.page404}`}>
            <h1>Page non trouvée ...</h1>
            <div className={styles.numbers}>404</div>
            <p className={styles.text}>Je n'ai pas compris votre demande ...</p>
        </main>
    )
}

export default memo(Page404);