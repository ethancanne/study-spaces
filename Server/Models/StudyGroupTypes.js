/**
 * Outlines the type of group that a study group can be,
 * ignoring whether or not the group is a tutor group.
 * This is used to determine the meeting preference of
 * a study group. This is used when searching for study groups.
 * @author Cameron Burkholder
 * @date   01/25/2022
 */
const StudyGroupTypes = {
    InPerson: "In person",
    Mixed: "In person or online",
    Online: "Online"
};
module.exports = StudyGroupTypes;
