import { Song } from './Song';
import { SongList } from './SongList';

(async () => {
    /*
    const list = await SongList.fromSongs([
        new Song('I Want to Hold Your Hand', 'Meet the Beatles!', 'The Beatles'),
        new Song('A Hard Day\'s Night', 'A Hard Day\'s Night', 'The Beatles'),
        new Song('Day Tripper', 'Rubber Soul', 'The Beatles'),
        new Song('Ticket To Ride', 'Help!', 'The Beatles'),
        new Song('Because', 'Abbey Road', 'The Beatles'),
        new Song('Back in the U.S.S.R.', 'The Beatles (The White Album)', 'The Beatles'),
        new Song('Birthday', 'The Beatles (The White Album)', 'The Beatles'),
        new Song('Blackbird', 'The Beatles (The White Album)', 'The Beatles'),
        new Song('Please Please Me', 'Please Please Me', 'The Beatles'),
        new Song('Boys', 'Please Please Me', 'The Beatles'),
        new Song('Daydream', 'Daydream', 'The Lovin\' Spoonful'),
        new Song('Daydream Believer', 'The Birds, The Bees & The Monkees', 'The Monkees'),
        new Song('Help!', 'Help!', 'The Beatles'),
        new Song('Eleanor Rigby', 'Revolver', 'The Beatles'),
        new Song('Lucy in the Sky with Diamonds', 'Sgt. Pepper\'s Lonely Hearts Club Band', 'The Beatles'),
        new Song('Come Together', 'Abbey Road', 'The Beatles'),
        new Song('Let It Be', 'Let It Be', 'The Beatles'),
        new Song('Yesterday', 'Help!', 'The Beatles'),
        new Song('Norwegian Wood', 'Rubber Soul', 'The Beatles'),
        new Song('Good Vibrations', 'Smiley Smile', 'The Beach Boys'),
        new Song('California Girls', 'Summer Days (And Summer Nights!!)', 'The Beach Boys'),
        new Song('God Only Knows', 'Pet Sounds', 'The Beach Boys'),
        new Song('Wouldn\'t It Be Nice', 'Pet Sounds', 'The Beach Boys'),
        new Song('Surfin\' USA', 'Surfin\' USA', 'The Beach Boys'),
        new Song('Fun, Fun, Fun', 'Shut Down Volume 2', 'The Beach Boys'),
        new Song('Mrs. Robinson', 'Bookends', 'Simon & Garfunkel'),
        new Song('The Sound of Silence', 'Sounds of Silence', 'Simon & Garfunkel'),
        new Song('Bridge Over Troubled Water', 'Bridge Over Troubled Water', 'Simon & Garfunkel'),
        new Song('Cecilia', 'Bridge Over Troubled Water', 'Simon & Garfunkel'),
        new Song('Scarborough Fair', 'Parsley, Sage, Rosemary and Thyme', 'Simon & Garfunkel'),
        new Song('Homeward Bound', 'Parsley, Sage, Rosemary and Thyme', 'Simon & Garfunkel'),
        new Song('Mrs. Brown You\'ve Got a Lovely Daughter', 'Herman\'s Hermits On Tour', 'Herman\'s Hermits'),
        new Song('I\'m Into Something Good', 'Herman\'s Hermits', 'Herman\'s Hermits'),
        new Song('Can\'t You Hear My Heartbeat', 'Herman\'s Hermits', 'Herman\'s Hermits'),
        new Song('I\'m a Believer', 'More of the Monkees', 'The Monkees'),
        new Song('Last Train to Clarksville', 'The Monkees', 'The Monkees'),
        new Song('Pleasant Valley Sunday', 'Pisces, Aquarius, Capricorn & Jones Ltd.', 'The Monkees'),
        new Song('She', 'More of the Monkees', 'The Monkees'),
        new Song('A Little Bit Me, A Little Bit You', 'The Monkees', 'The Monkees'),
        new Song('Do Wah Diddy Diddy', 'The Manfred Mann Album', 'Manfred Mann'),
        new Song('Pretty Flamingo', 'Pretty Flamingo', 'Manfred Mann'),
        new Song('Sha La La', 'The Five Faces of Manfred Mann', 'Manfred Mann'),
        new Song('House of the Rising Sun', 'The Animals', 'The Animals'),
        new Song('Don\'t Let Me Be Misunderstood', 'Animal Tracks', 'The Animals'),
        new Song('We Gotta Get Out of This Place', 'Animal Tracks', 'The Animals'),
        new Song('She Loves You', 'The Beatles Second Album', 'The Beatles'),
        new Song('Twist and Shout', 'Please Please Me', 'The Beatles'),
        new Song('Eight Days a Week', 'Beatles for Sale', 'The Beatles'),
        new Song('Drive My Car', 'Rubber Soul', 'The Beatles'),
        new Song('Nowhere Man', 'Rubber Soul', 'The Beatles'),
        new Song('Paperback Writer', 'Yesterday and Today', 'The Beatles'),
        new Song('Rain', 'Yesterday and Today', 'The Beatles'),
        new Song('Yellow Submarine', 'Revolver', 'The Beatles'),
        new Song('Penny Lane', 'Magical Mystery Tour', 'The Beatles'),
        new Song('Strawberry Fields Forever', 'Magical Mystery Tour', 'The Beatles'),
        new Song('All You Need Is Love', 'Magical Mystery Tour', 'The Beatles'),
        new Song('Hello, Goodbye', 'Magical Mystery Tour', 'The Beatles'),
        new Song('Lady Madonna', 'Hey Jude', 'The Beatles'),
        new Song('Hey Jude', 'Hey Jude', 'The Beatles'),
        new Song('Ob-La-Di, Ob-La-Da', 'The Beatles (The White Album)', 'The Beatles'),
        new Song('Revolution', 'The Beatles (The White Album)', 'The Beatles'),
        new Song('While My Guitar Gently Weeps', 'The Beatles (The White Album)', 'The Beatles'),
        new Song('Get Back', 'Let It Be', 'The Beatles'),
        new Song('Something', 'Abbey Road', 'The Beatles'),
        new Song('Come and Get It', 'Magic Christian Music', 'Badfinger'),
        new Song('No Matter What', 'No Dice', 'Badfinger'),
        new Song('Day After Day', 'Straight Up', 'Badfinger'),
        new Song('Baby Blue', 'Straight Up', 'Badfinger'),
        new Song('Without You', 'No Dice', 'Badfinger'),
        new Song('Bus Stop', 'Bus Stop', 'The Hollies'),
        new Song('He Ain\'t Heavy, He\'s My Brother', 'Hollies Sing Hollies', 'The Hollies'),
        new Song('Carrie Anne', 'Evolution', 'The Hollies'),
        new Song('Look Through Any Window', 'Hear! Here!', 'The Hollies'),
        new Song('Long Cool Woman (In a Black Dress)', 'Distant Light', 'The Hollies'),
        new Song('On a Carousel', 'Evolution', 'The Hollies'),
        new Song('Stop! In the Name of Love', 'More Hits by The Supremes', 'The Supremes'),
        new Song('You Can\'t Hurry Love', 'The Supremes A\' Go-Go', 'The Supremes'),
        new Song('Baby Love', 'Where Did Our Love Go', 'The Supremes'),
        new Song('Where Did Our Love Go', 'Where Did Our Love Go', 'The Supremes'),
        new Song('My Girl', 'The Temptations Sing Smokey', 'The Temptations'),
        new Song('Ain\'t Too Proud to Beg', 'Gettin\' Ready', 'The Temptations'),
        new Song('I Can\'t Help Myself (Sugar Pie Honey Bunch)', 'Second Album', 'Four Tops'),
        new Song('Reach Out I\'ll Be There', 'Reach Out', 'Four Tops'),
        new Song('Standing in the Shadows of Love', 'Reach Out', 'Four Tops'),
        new Song('This Old Heart of Mine', 'This Old Heart of Mine', 'The Isley Brothers'),
        new Song('It\'s the Same Old Song', 'Four Tops Second Album', 'Four Tops'),
        new Song('Dancing in the Street', 'Dance Party', 'Martha and the Vandellas'),
        new Song('Heat Wave', 'Heat Wave', 'Martha and the Vandellas'),
        new Song('Nowhere to Run', 'Dance Party', 'Martha and the Vandellas'),
        new Song('You Really Got Me', 'Kinks', 'The Kinks'),
        new Song('All Day and All of the Night', 'Kinks-Size', 'The Kinks'),
        new Song('Tired of Waiting for You', 'Kinda Kinks', 'The Kinks'),
        new Song('Sunny Afternoon', 'Face to Face', 'The Kinks'),
        new Song('Waterloo Sunset', 'Something Else by The Kinks', 'The Kinks'),
        new Song('Lola', 'Lola Versus Powerman and the Moneygoround, Part One', 'The Kinks'),
    ]);
    */
    const list = await SongList.fromCsvFile(new URL('examples/example.csv', 'file:' + __dirname));
    const { genres, unknownSongs } = await list.getGenres();
    for (const genre of genres) {
        console.log(`Genre: ${genre.genre}`);
        for (const song of genre.songs) {
            console.log(`  - ${song.title} by ${song.artist}`);
        }
    }
    if (unknownSongs.length) {
        console.log('Unknown songs:');
        for (const song of unknownSongs) {
            console.log(`  - ${song.title} by ${song.artist}`);
        }
    }
})().catch(e => {
    console.error(e);
    process.exit(1);
});
