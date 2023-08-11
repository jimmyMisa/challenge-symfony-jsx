class Requirement {
	static data = {}
    static add(key, then = ()=>{}) {
        Requirement.data[key] = then;
        return Requirement.data
    }
    static load(key=null) {
    	if (
    		Requirement.data &&
    		Object.keys(Requirement.data).length !== 0
    	) {
    		if (
    			key && 
    			Requirement.data[key] !== undefined && 
    			(typeof Requirement.data[key] === "function")
    		) {
		    	Requirement.data[key]();
    		}
    		else {
    			Requirement.run()
    		}
    	}
    }
    static run(){
		Object.keys(Requirement.data).map(function(prop) {
		  if (typeof Requirement.data[prop] === "function") {
		    Requirement.data[prop]();
		  }
		});
    }
}
export default Requirement