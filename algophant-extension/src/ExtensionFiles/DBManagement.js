
export function CreateDb(db_name) {
    const request = window.indexedDB.open("MyTestDatabase", 3);
    return(request)
}

export function save_to_local_storage(key,value) {
    localStorage.setItem(key,value)
}

export function get_data_from_local_storage(key) {
    return(localStorage.getItem(key))
}