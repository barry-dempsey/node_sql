/**
 * Created by johndoe on 28/10/15.
 */
function Booking () {
    this.type = type;
    this.name = name;
    this.lastName = lastName;
    this.getDetails = function() {
        return this.type + this.name + this.lastName;
    }
}
exports.module = Booking;