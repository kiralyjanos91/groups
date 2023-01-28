const categories = [
    "Arts & Culture",
    "Book Clubs",
    "Career & Business",
    "Cars & Motorcycles",
    "Community & Environment",
    "Dancing",
    "Education & Learning",
    "Fashion & Beauty",
    "Fitness",
    "Food & Drink",
    "Games",
    "Health & Wellbeing",
    "Hobbies & Crafts",
    "Language & Ethnic Identity",
    "Lifestyle",
    "Movements & Politics",
    "Movies & Film",
    "Music",
    "New Age & Spirituality",
    "Outdoors & Adventure",
    "Paranormal",
    "Parents & Family",
    "Pets & Animals",
    "Photography",
    "Religion & Beliefs",
    "Sci-Fi & Fantasy",
    "Socializing",
    "Sports & Recreation",
    "Tech",
    "Writing"
]

export const groupCategoryOptions = categories.map(( category , index ) => {
    return (
        <option 
            key = { index }
            value = { category }
        >
            { category }
        </option>
    )
})