import "./header.css"

export const Header = (props) => {

    return(
        <header>
            <span className="logo">Wthr</span>
            <div>
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        props.onSubmit()
                    }} 
                >
                    <input
                        name="Search Bar"
                        type="text"
                        placeholder="Назва міста"
                        onChange={e => props.setSearchValue(e.target.value)}
                    ></input>
                    <button type="submit">Пошук</button>
                </form>
            </div>
        </header>
    )
}