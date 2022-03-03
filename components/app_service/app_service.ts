export class AppService{
    public async get(): Promise<any> {
        const response = await fetch('/api/users');
        return await response.json();
    }

    public async addUser(user: any) {
        const response = await fetch(`/api/user`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({user})
          })
        return await response.json();
    }
}