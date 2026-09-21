// Stable IDs allow the seed script to be safely run more than once.
export const lessons = [
  { topic: 'Creative studio', location: 'Hendon', price: 28, category: 'Art', teacherId: 'maya-patel', day: 'Monday', time: '16:00', age: '8–12', image: '/images/art.svg' },
  { topic: 'Code club', location: 'Colindale', price: 35, category: 'Technology', teacherId: 'sam-wilson', day: 'Tuesday', time: '16:30', age: '10–14', image: '/images/code.svg' },
  { topic: 'Football skills', location: 'Brent Cross', price: 22, category: 'Sport', teacherId: 'alex-green', day: 'Wednesday', time: '16:00', age: '8–12', image: '/images/football.svg' },
  { topic: 'Piano explorers', location: 'Golders Green', price: 40, category: 'Music', teacherId: 'maya-patel', day: 'Thursday', time: '16:30', age: '7–11', image: '/images/music.svg' },
  { topic: 'Science lab', location: 'Hendon', price: 32, category: 'Science', teacherId: 'sam-wilson', day: 'Friday', time: '16:00', age: '9–13', image: '/images/science.svg' },
  { topic: 'Drama workshop', location: 'Finchley', price: 26, category: 'Performing arts', teacherId: 'jules-brown', day: 'Monday', time: '17:00', age: '8–13', image: '/images/drama.svg' },
  { topic: 'Maths detectives', location: 'Colindale', price: 25, category: 'Learning', teacherId: 'sam-wilson', day: 'Wednesday', time: '17:00', age: '9–12', image: '/images/maths.svg' },
  { topic: 'Basketball crew', location: 'Finchley', price: 24, category: 'Sport', teacherId: 'alex-green', day: 'Thursday', time: '16:00', age: '10–14', image: '/images/basketball.svg' },
  { topic: 'Street dance', location: 'Brent Cross', price: 27, category: 'Performing arts', teacherId: 'jules-brown', day: 'Tuesday', time: '17:00', age: '8–14', image: '/images/dance.svg' },
  { topic: 'Young writers', location: 'Golders Green', price: 20, category: 'Learning', teacherId: 'maya-patel', day: 'Friday', time: '16:30', age: '9–13', image: '/images/writing.svg' },
].map((lesson, index) => ({ _id: (index + 1).toString(16).padStart(24, '0'), ...lesson, space: 5 }))
