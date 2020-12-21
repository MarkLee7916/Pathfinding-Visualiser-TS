export class Vertice<T> {
    private distance: number;
    private data: T

    constructor(data: T) {
        this.distance = Infinity;
        this.data = data;
    }

    public updateDist(newDist: number) {
        this.distance = newDist;
    }

    public dist() {
        return this.distance;
    }

    public val() {
        return this.data;
    }
}
