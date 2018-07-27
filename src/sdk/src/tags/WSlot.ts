
import Tag from './Tag';

export default class WSlot extends Tag {

    public static isSlot(tag: string): boolean {
        if (/^<[\/]?w-slot/.test(tag)) {
            return true;
        }
        return false;
    }
}