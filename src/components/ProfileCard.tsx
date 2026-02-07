import { MapPin, Users, User } from "lucide-react";

interface ProfileCardProps {
  role: string;
  name: string;
  location: string;
  citizens?: string;
}

const ProfileCard = ({ role, name, location, citizens }: ProfileCardProps) => {
  return (
    <div className="hero-gradient rounded-xl p-6 lg:p-8 text-white">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        {/* Avatar */}
        <div className="w-28 h-28 lg:w-32 lg:h-32 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
          <User className="w-16 h-16 lg:w-20 lg:h-20 text-white/70" />
        </div>
        
        {/* Info */}
        <div className="text-center md:text-left">
          <span className="text-white/80 text-sm font-medium">{role}</span>
          <h1 className="text-2xl lg:text-3xl font-bold mt-1 mb-3">{name}</h1>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-white/80 text-sm">
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              {location}
            </span>
            {citizens && (
              <span className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                {citizens}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
