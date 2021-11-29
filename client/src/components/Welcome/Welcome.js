import {NavLink} from 'react-router-dom';

import useTitle from '../../hooks/useTitle';

import styles from './Welcome.module.css';
import demo from '../../assets/pongDemo.mp4'

const Welcome = () => {
    useTitle('Accueil');
    return (
        <main className="main">
            <h1>Pong, un des premiers jeux vidéo d'arcade </h1>
            <section className={styles.content}>
                <p>Le jeu est inspiré du tennis de table en vue de dessus, et chaque joueur s'affronte en déplaçant la raquette virtuelle de haut en bas, de façon à garder la balle dans le terrain de jeu.</p> 
                <p>Le joueur peut changer la direction de la balle en fonction de l'endroit où celle-ci tape sur la raquette, alors que sa vitesse augmente graduellement au cours de la manche.</p>
                <p>Le score de chaque joueur est affiché pour la partie en cours.</p>
                <div>
                    <NavLink to='/game'>Démarrer une partie</NavLink>
                    <NavLink to='/game'>Afficher les scores</NavLink>
                </div>
                <p>Une démonstration du principe du jeu :</p>
                <video src={demo} controls={true} alt="Démonstration du jeu Pong original" />
            </section>
        </main>
    )
}

export default Welcome;